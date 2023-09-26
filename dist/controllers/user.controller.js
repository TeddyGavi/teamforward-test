"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const index_1 = require("../models/index");
const mongoose_1 = require("mongoose");
const logging_1 = require("../utils/logging");
const mongoose_2 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const index_2 = require("../utils/index");
const cloudinary_config_1 = __importDefault(require("../lib/cloudinary.config"));
const ObjectId = mongoose_1.Types.ObjectId;
class UserController {
    constructor() { }
    createNewUser(req, res) {
        index_1.UserModel.create(req.body)
            .then((newUser) => {
            const payload = { id: newUser._id };
            const userToken = jsonwebtoken_1.default.sign(payload, (process.env.SecretKeyOne ??= ''));
            res
                .cookie('jwt-token', userToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            })
                .json(newUser);
        })
            .catch((err) => {
            (0, logging_1.log)('Something went wrong with createNewUser');
            res.status(400).json(err);
        });
    }
    loggedInUser(req, res) {
        (0, logging_1.log)('userId', req.userId);
        index_1.UserModel.findOne({ _id: req.userId }, { password: 0 })
            .then((loggedUser) => {
            (0, logging_1.log)(loggedUser);
            res.json(loggedUser);
        })
            .catch((err) => {
            (0, logging_1.log)('Find logged In user failed', err);
        });
    }
    async login(req, res) {
        (0, logging_1.log)(req.body.email, req.body.password);
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Something went wrong with login');
        }
        const user = await index_1.UserModel.findOne({ email: req.body.email });
        if (user === null) {
            return res.status(400).send('Incorrect Email');
        }
        const correctPassword = await bcrypt_1.default.compare(req.body.password, user.password);
        if (!correctPassword) {
            return res.status(400).send('Incorrect Password');
        }
        const userToken = jsonwebtoken_1.default.sign({
            id: user._id,
        }, (process.env.SecretKeyOne ??= ''));
        res
            .cookie('jwt-token', userToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        })
            .json({ msg: 'success!', user: user });
    }
    findOneUser(req, res) {
        let findId;
        try {
            findId = new mongoose_2.default.Types.ObjectId(req.params.id);
        }
        catch (err) {
            res.status(404).json('This user could not be found');
            return;
        }
        index_1.UserModel.findOne({ _id: findId })
            .then((oneUser) => {
            (0, logging_1.log)(oneUser);
            if (oneUser === null) {
                res.status(404).json('This user could not be found');
            }
            else {
                res.json(oneUser);
            }
        })
            .catch((err) => {
            res.json({
                message: 'Something went wrong in findOneUser',
                error: err,
            });
            (0, logging_1.log)('findOneUser failed');
        });
    }
    async findAllUsers(req, res) {
        const userInfo = await index_1.UserModel.findOne({ _id: req.userId }, { password: 0 });
        // const interests = req.query['interests'];
        const activities = req.query['activities'].toString();
        const results = await (0, index_2.getUsersWithinRadius)(userInfo?.location?.coordinates, userInfo?.radius, activities, req.userId);
        res.json(results);
    }
    async updateUser(req, res) {
        let body = { ...req.body };
        (0, logging_1.log)('FIRST LOG HERE REQ.BODY:', body, 'FIRST LOG REQ.PARAMS', req.params);
        if (body.photo) {
            //if there's an existing cloudinaryProfileImgUrl/cloudinaryId, then delete it from cloudinary
            //TODO: once user tries to upload 5th photo, prompt to delete one from list first. Also alow delete from list in general.
            // let currentUser = await User.findById({ _id: req.params.id })
            // try {
            //   await cloudinary.uploader.destroy(currentUser.cloudinaryId);
            // } catch (exception) {
            //   console.log("Something went wrong with updateUser", exception);
            // }
            let result;
            try {
                result = await cloudinary_config_1.default.uploader.upload(body.photo);
                const { secure_url, public_id } = result;
                body.cloudinaryProfileImgUrl = secure_url;
                body.cloudinaryId = public_id;
                delete body.photo;
            }
            catch (exception) {
                res.status(400).json(exception);
                (0, logging_1.log)('Something went wrong with cloudinary upload');
            }
        }
        if (body.zipCode) {
            const address = body.zipCode;
            const locationData = await (0, index_2.getLocationHelper)(address);
            let location;
            if (locationData?.length > 0) {
                location = locationData[0];
            }
            const coordinates = [location.longitude, location.latitude];
            body = {
                ...body,
                location: {
                    type: 'Point',
                    coordinates,
                },
                // location2: {
                //   type:'Point',
                //   coordinates
                // }
            };
        }
        if (!body.zipCode) {
            body.location = { undefined };
        }
        index_1.UserModel.findOneAndUpdate({ _id: req.params.id }, { $set: body }, { new: true })
            .then((updatedUser) => {
            (0, logging_1.log)('updatedUser:', updatedUser);
            res.json(updatedUser);
        })
            .catch((err) => {
            res.status(400).json(err);
            console.log('Something went wrong with updatedUser');
        });
    }
    async uploadGallery(req, res) {
        const body = { ...req.body };
        (0, logging_1.log)('FIRST LOG HERE REQ.BODY:', body, 'FIRST LOG REQ.PARAMS', req.params);
        const currentUser = await index_1.UserModel.findById({ _id: req.params.id });
        let photo;
        if (body.file) {
            try {
                const result = await cloudinary_config_1.default.uploader.upload(body.file);
                const { secure_url, public_id } = result;
                const cloudinaryImgUrl = secure_url;
                const cloudinaryId = public_id;
                photo = new index_1.PhotoModel({ cloudinaryImgUrl, cloudinaryId });
                currentUser.photos.push(photo);
            }
            catch (exception) {
                res.status(400).json(exception);
                (0, logging_1.log)('Something went wrong with cloudinary upload');
            }
        }
        // currentUser.save();
        // res.json(currentUser);
        index_1.UserModel.findByIdAndUpdate({ _id: req.params.id }, {
            photos: currentUser.photos,
        }, { new: true })
            .then((updatedUser) => {
            res.json(updatedUser);
        })
            .catch((err) => {
            res.status(400).json(err);
            console.log('Something went wrong with updateGallery');
        });
    }
    // Change Profile Picture by clicking on photos in gallery
    async updateGallery(req, res) {
        let newImgUrl, newImgId;
        const currentUser = await index_1.UserModel.findById({ _id: req.params.id });
        try {
            const foundPhoto = currentUser.photos.find((photo) => photo._id.equals(new ObjectId(req.params.photoId)));
            newImgUrl = foundPhoto.cloudinaryImgUrl;
            newImgId = foundPhoto.cloudinaryId;
        }
        catch (exception) {
            res.status(400).json(exception);
            (0, logging_1.log)('Something went wrong with finding photo');
        }
        index_1.UserModel.findByIdAndUpdate({ _id: req.params.id }, {
            cloudinaryId: newImgId,
            cloudinaryProfileImgUrl: newImgUrl,
        }, { new: true })
            .then((updatedUser) => {
            res.json(updatedUser);
        })
            .catch((err) => {
            res.status(400).json(err);
            (0, logging_1.log)('Something went wrong with updateGallery');
        });
    }
    async deleteGallery(req, res) {
        const currentUser = await index_1.UserModel.findById({ _id: req.params.id });
        const photoId = req.params.photoId;
        const photoIndex = currentUser.photos.findIndex((photo) => photo._id.equals(new ObjectId(photoId)));
        const photo = currentUser.photos[photoIndex];
        try {
            await cloudinary_config_1.default.uploader.destroy(photo.cloudinaryId);
        }
        catch (exception) {
            console.log('Something went wrong with deleteGallery', exception);
        }
        currentUser.photos.splice(photoIndex, 1);
        index_1.UserModel.findByIdAndUpdate({ _id: req.params.id }, {
            photos: currentUser.photos,
            cloudinaryId: currentUser.cloudinaryId === photo.cloudinaryId
                ? null
                : currentUser.cloudinaryId,
            cloudinaryProfileImgUrl: currentUser.cloudinaryProfileImgUrl === photo.cloudinaryImgUrl
                ? null
                : currentUser.cloudinaryProfileImgUrl,
        }, { new: true })
            .then((updatedUser) => {
            res.json(updatedUser);
        })
            .catch((err) => {
            res.status(400).json(err);
            (0, logging_1.log)('Something went wrong with deleteGallery');
        });
    }
    logOut(res) {
        res.clearCookie('jwt-token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });
        res.sendStatus(200);
    }
    deleteUser(req, res) {
        index_1.UserModel.deleteOne({ _id: req.params.id })
            .then((deletedUser) => {
            (0, logging_1.log)(deletedUser);
            res.json(deletedUser);
        })
            .catch((err) => {
            res.json({
                message: 'Something went wrong with deleteUser',
                error: err,
            });
            (0, logging_1.log)('deleteUser failed');
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map