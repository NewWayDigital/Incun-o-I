const bcrypt= require('bcrypt')
const jwt= require('jsonwebtoken')
const {User, Patient} = require('../models')
const ENV= require('../config')
const createError= require('../middlewares/error')
const { ValidationError}= require('sequelize')
const { UniqueConstraintError}= require('sequelize')


exports.signup = async (req,res,next) => {
    try {
        // Hachage du mot de passe 
        const hashpassword= await bcrypt.hash(req.body.password, 10);
        // Creation de l'utilisateur

        const user = await User.create({
            ...req.body,
            password: hashpassword,
        })
        // Exclusion du mot de passe
      const { password, ...userData } = user.dataValues;
        res.status(201).json({message:"Utilisateur ajouté avec succès",data:userData})

    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(400).json({message:error.message, data:error})
        }
        if (error instanceof UniqueConstraintError) {
            return res.status(400).json({message:error.message, data:error})
        }
        next(createError(500,"Erreur lors de l'inscription ", error.message))
    }
}

exports.signin = async (req, res, next) => {
    try {
      const user = await User.findOne({ 
        where: { email: req.body.email },
        include: [{
          model: Patient,
          attributes: ['id', 'nom']
        }]
      });
      
      if (!user) {
        return next(createError(404, "Utilisateur non trouvé"));
      }
  
      // Vérifier le type d'utilisateur
      if (req.body.userType && user.role !== req.body.userType) {
        return next(createError(403, "Type d'utilisateur non autorisé"));
      }
  
      // Vérification 2FA pour le personnel médical
      if (user.role === 'medical' && user.twoFactorCode) {
        if (req.body.twoFactorCode !== user.twoFactorCode) {
          return next(createError(401, "Code 2FA incorrect"));
        }
      }
  
      // Vérification du mot de passe
      const comparePassword = await bcrypt.compare(req.body.password, user.password);
      if (!comparePassword) {
        return next(createError(400, "Identifiants incorrects"));
      }

      // Mettre à jour le statut de l'utilisateur à true
      await user.update({ status: true });

      // Génération du token
      const token = jwt.sign({ id: user.id }, ENV.TOKEN, { expiresIn: '24h' });
  
      // Exclusion du mot de passe
      const { password, ...userData } = user.dataValues;
  
      // Réponse
      res
        .cookie('access_token', token, {
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000
        })
        .status(200)
        .json({
          success: true,
          token,
          user: userData
        });
  
    } catch (error) {
      console.error("Erreur backend signin:", error);
      next(createError(500, "Erreur lors de la connexion"));
    }
  };
  
exports.getAllUseurs= async (req,res,next) =>{

try {
    const useurs= await User.findAll({ attributes:{exclude:['password']}})
    res.status(200).json(useurs)
} catch (error) {
    next.status(createError("Erreur lors de la récupération de tout les useurs",error.message))

}

}

exports.updateUser = async (req, res, next) => {
    const userId = req.params.id;
    const updatedData = { ...req.body };
  
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return next(createError(404, "Utilisateur non trouvé"));
      }
  
      // Hasher le mot de passe s'il est fourni
      if (req.body.password && req.body.password.trim() !== '') {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        updatedData.password = hashedPassword;
      } else {
        // Ne pas mettre à jour le mot de passe si non fourni
        delete updatedData.password;
      }
  
      await user.update(updatedData);
      const { password, ...userSansMotDePasse } = user.toJSON();
  
      res.status(200).json({
        message: "Utilisateur mis à jour avec succès",
        user: userSansMotDePasse
      });
  
    } catch (error) {
      if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
        return res.status(400).json({ message: error.message, data: error });
      }
  
      next(createError(500, `Erreur lors de la mise à jour de l'utilisateur : ${error.message}`));
    }
  };

exports.deleteUser =async (req,res,next) =>{
    const useurId=req.params.id;
    try {
        const user= await User.findByPk(useurId)
        if (!user) {
            return next (createError(404,"Utilisateur non trouvé"))
        }
        await User.destroy({where:{id:useurId}})
        res.status(200).json({
            message:"Utilisateur supprimé avec succès"
        })
    } catch (error) {
        next(createError(500, `Erreur lors de la supression de l'user : ${error.message}`));
    }
}

exports.logout = async (req, res, next) => {
    try {
      console.log('Déconnexion demandée');
      console.log('Headers:', req.headers);
      console.log('User:', req.user);
      
      if (!req.user || !req.user.id) {
        console.log('Erreur: Utilisateur non authentifié');
        return next(createError(401, "Utilisateur non authentifié"));
      }

      const userId = req.user.id;
      console.log('ID de l\'utilisateur:', userId);
      
      const user = await User.findByPk(userId);
      
      if (!user) {
        console.log('Utilisateur non trouvé:', userId);
        return next(createError(404, "Utilisateur non trouvé"));
      }

      console.log('Statut actuel de l\'utilisateur:', user.status);
      console.log('Mise à jour du statut de l\'utilisateur:', userId);
      
      // Mettre à jour le statut de l'utilisateur à false
      await user.update({ status: false });
      
      console.log('Nouveau statut de l\'utilisateur:', (await user.reload()).status);
      
      console.log('Déconnexion réussie pour l\'utilisateur:', userId);
      res.status(200).json({
        success: true,
        message: "Déconnexion réussie"
      });
    } catch (error) {
      console.error("Erreur détaillée backend logout:", error);
      next(createError(500, "Erreur lors de la déconnexion"));
    }
  };