import User from '../../models/User';
import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { seedDb } from '../../utils/seed';
import Aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

const router = Router();

router.post('/editProfileInfo', requireJwtAuth, async (req, res) => {
  try {
    let updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $set: { personalInfo: req.body } },
      { new: true },
    );
    return await res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/addProject', requireJwtAuth, async (req, res) => {
  try {
    let updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $push: { projects: req.body } },
      { new: true },
    );
    return await res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/editProject', requireJwtAuth, async (req, res) => {
  try {
    let updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $set: { projects: req.body } },
      { new: true },
    );
    return await res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/addSideProject', requireJwtAuth, async (req, res) => {
  try {
    let updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $push: { sideProjects: req.body } },
      { new: true },
    );
    return await res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/editSideProject', requireJwtAuth, async (req, res) => {
  try {
    let updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $set: { sideProjects: req.body } },
      { new: true },
    );
    return await res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/addWritings', requireJwtAuth, async (req, res) => {
  try {
    let updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $push: { writings: req.body } },
      { new: true },
    );
    return await res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/editWritings', requireJwtAuth, async (req, res) => {
  try {
    let updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $set: { writings: req.body } },
      { new: true },
    );
    return await res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/addAwards', requireJwtAuth, async (req, res) => {
  try {
    let updatedUser = await User.findOneAndUpdate({ _id: req.user.id }, { $push: { awards: req.body } }, { new: true });
    return await res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/editAwards', requireJwtAuth, async (req, res) => {
  try {
    let updatedUser = await User.findOneAndUpdate({ _id: req.user.id }, { $set: { awards: req.body } }, { new: true });
    return await res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/addFeatures', requireJwtAuth, async (req, res) => {
  try {
    let updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $push: { features: req.body } },
      { new: true },
    );
    return await res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/editFeatures', requireJwtAuth, async (req, res) => {
  try {
    let updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $set: { features: req.body } },
      { new: true },
    );
    return await res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/addCertifications', requireJwtAuth, async (req, res) => {
  try {
    let updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $push: { certifications: req.body } },
      { new: true },
    );
    return await res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/editCertifications', requireJwtAuth, async (req, res) => {
  try {
    let updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $set: { certifications: req.body } },
      { new: true },
    );
    return await res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/addEducation', requireJwtAuth, async (req, res) => {
  try {
    let updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $push: { education: req.body } },
      { new: true },
    );
    return await res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/editEducation', requireJwtAuth, async (req, res) => {
  try {
    let updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $set: { education: req.body } },
      { new: true },
    );
    return await res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/addExperience', requireJwtAuth, async (req, res) => {
  try {
    let updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $push: { experiences: req.body } },
      { new: true },
    );
    return await res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/editExperience', requireJwtAuth, async (req, res) => {
  try {
    let updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $set: { experiences: req.body } },
      { new: true },
    );
    return await res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/addSpeaking', requireJwtAuth, async (req, res) => {
  try {
    let updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $push: { speaking: req.body } },
      { new: true },
    );
    return await res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/editSpeaking', requireJwtAuth, async (req, res) => {
  try {
    let updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $set: { speaking: req.body } },
      { new: true },
    );
    return await res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/addExhibitions', requireJwtAuth, async (req, res) => {
  try {
    let updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $push: { exhibitions: req.body } },
      { new: true },
    );
    return await res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/editExhibitions', requireJwtAuth, async (req, res) => {
  try {
    let updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $set: { exhibitions: req.body } },
      { new: true },
    );
    return await res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/addLinks', requireJwtAuth, async (req, res) => {
  try {
    let updatedUser = await User.findOneAndUpdate({ _id: req.user.id }, { $push: { links: req.body } }, { new: true });
    return await res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/editLinks', requireJwtAuth, async (req, res) => {
  try {
    let updatedUser = await User.findOneAndUpdate({ _id: req.user.id }, { $set: { links: req.body } }, { new: true });
    return await res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/profilePic', requireJwtAuth, async (req, res) => {
  console.log('heloo', req.user);
  const s3 = new Aws.S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_BUCKET_REGION,
  });
  const upload = (bucketName) =>
    multer({
      storage: multerS3({
        s3,
        bucket: bucketName,
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
          cb(null, `${req.user.username}-img-${Date.now()}`);
        },
      }),
    });
  try {
    var params = {
      Bucket: 'pever-pictures',
      Key: req.user.picture.split('amazonaws.com/')[1],
    };
    s3.deleteObject(params, function (err, data) {
      if (err) console.log(err, err.stack);
      else console.log('deleted'); // deleted
    });
    const uploadSingle = upload('pever-pictures').single('profilePic');
    uploadSingle(req, res, async (err) => {
      if (err) return res.status(400).json({ success: false, message: err.message });
      let updatedUser = await User.findOneAndUpdate(
        { _id: req.user.id },
        { $set: { picture: req.file.location } },
        { new: true },
      );
      return await res.status(200).json(updatedUser);
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
