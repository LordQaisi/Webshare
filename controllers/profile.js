let sidebar = require('../helpers/sidebar');
let userModel = require('../models/user');
let imageModel = require('../models/image');
let commentModel = require('../models/comment');
let async = require('async');
let fs = require('fs');
let path = require('path');

module.exports = {
        index: function(req, res){
            let viewModel = {
                user: req.user
            }

            sidebar(viewModel, function(viewModel){
                res.render('profile', viewModel);
            });
            
        },
    retrieve:function(req, res){
        userModel.findById(req.params.user_id, function(err, user){
             if(err){throw err}
 
             if(user){
                 res.json(user);
             }else{
                 res.end();
             }
        }); 
    },
    update:function(req, res){
        userModel.findById(req.params.user_id, function(err, result){
            console.log('RESULT = ' + result);
            if(err){
                throw err;
            }
            if(result){
                result.firstname = req.body.firstname;
                result.lastname = req.body.lastname;
                result.email = req.body.email;


                result.save(function(err){
                    if(err){throw err;}

                    res.redirect('/profile');
                });
            }
        });
    },
    chatroom:function(req,res){
        let viewModel = {

        }
        sidebar(viewModel, function(viewModel){
            res.render('chatroom', viewModel);
        })
        
    },
    getEmail:function(req,res){
        userModel.findOne({email:req.params.user_email},function(err, user){
            if(err){throw err};

            if(user){
                if(user.email == req.user.email){
                    res.json(true);
                }
            }else{
                res.json(false);
            }
        })
    },
    delete:function(req, res){
        userModel.findOne({email:req.params.user_email}, function(err, user){
            if(err) {throw err};

            if(user){
                imageModel.find({user_id:user._id},function(err, images){

                    let deleteImage = function(image, next){
                        fs.unlink(path.resolve('./public/upload/' + image.filename),function(err){

                            commentModel.remove({'image_id':image._id}, function(err){
                                if(err){throw err;}
                            
                                image.remove(function(err){
                                    if(err){throw err};
                                });
                            });
                               next(err);
                            });
                    }

                    async.each(images, deleteImage, function(err){
                        if(err){throw err;}
                    
                        console.log('Done Deleting all images');
                });

                user.remove(function(err){
                        if(err){
                            res.json(err);
                        }else{
                            res.json(true);
                        }
                    });
                });
            }
        });
    }
}
