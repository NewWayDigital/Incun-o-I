import React, { useEffect, useState } from 'react';
import '../../../styles/AdminDashboard.css';
import axios from 'axios';
// Configuration d'axios pour le backend
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Le serveur a répondu avec un statut d'erreur
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      return Promise.reject({ message: 'Erreur de connexion au serveur' });
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      return Promise.reject({ message: 'Erreur lors de la configuration de la requête' });
    }
  }
);

const UserManagement = () => {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // État pour les données du formulaire d'ajout d'utilisateur
  const [newUserData, setNewUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    numberPhone:'',
    password: '',
    confirmPassword: ''
  });

  // Mock data - would be replaced with actual API calls in a real application
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/user/all')
      .then(response => {
        setUsers(response.data); // adapte selon la structure de ton backend
        console.log(response.data)
      })
      .catch(err => {
        alert(err.message || "Erreur lors du chargement des utilisateurs.");
      });
  }, []);

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'role-admin';
      case 'doctor': return 'role-doctor';
      case 'nurse': return 'role-nurse';
      case 'parent': return 'role-parent';
      default: return '';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'doctor': return 'Médecin';
      case 'nurse': return 'Infirmière';
      case 'parent': return 'Parents';
      default: return role;
    }
  };

  // Gérer les changements dans le formulaire d'ajout
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData({ ...newUserData, [name]: value });
  };

  // Gérer les changements dans le formulaire d'édition
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  // Ouvrir le modal d'édition
  const handleOpenEditModal = (user) => {
    setEditingUser({
      ...user,
      password: '',
      confirmPassword: ''
    });
    setShowEditUserModal(true);
  };

  // Mettre à jour un utilisateur
  const handleUpdateUser = () => {
    if (!editingUser.firstName || !editingUser.lastName || !editingUser.email || !editingUser.role) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
  
    if (
      (editingUser.password || editingUser.confirmPassword) &&
      editingUser.password !== editingUser.confirmPassword
    ) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }
  
    // Nettoyer les champs de mot de passe s'ils sont vides
    const updatedUser = { ...editingUser };
    if (!updatedUser.password) delete updatedUser.password;
    if (!updatedUser.confirmPassword) delete updatedUser.confirmPassword;
  
    api.put(`user/update/${editingUser.id}`, updatedUser)
      .then(response => {
        setUsers(users.map(user =>
          user.id === editingUser.id ? response.data.user : user
        ));
        console.log(response.data.user)
  
        setShowEditUserModal(false);
        setEditingUser(null);
  
        setNewUserData({
          firstName: '',
          lastName: '',
          email: '',
          role: '',
          numberPhone: '',
          password: '',
          confirmPassword: ''
        });
      })
      .catch(err => {
        alert(err.message || "Erreur lors de la mise à jour de l'utilisateur.");
      });
  };
  

  // Changer le statut d'un utilisateur
  const toggleUserStatus = () => {
    setEditingUser({
      ...editingUser,
      status: editingUser.status === 'active' ? 'inactive' : 'active'
    });
  };

  // Ajouter un nouvel utilisateur
  const handleAddUser = () => {
    // Validation de base
    if (
      !newUserData.firstName ||
      !newUserData.lastName ||
      !newUserData.email ||
      !newUserData.role ||
      !newUserData.numberPhone ||
      !newUserData.password ||
      newUserData.password !== newUserData.confirmPassword
    ) {
      alert("Veuillez remplir tous les champs correctement. Les mots de passe doivent correspondre.");
      return;
    }

    // Créer un nouvel utilisateur
    const newUser = {
      firstName: newUserData.firstName,
      lastName: newUserData.lastName,
      email: newUserData.email,
      role: newUserData.role,
      numberPhone:newUserData.numberPhone,
      password: newUserData.password,
      status: 'active'
    };
    

    api.post('user/register', newUser)
      .then(response => {
        setUsers([...users, response.data.data]);
        setShowAddUserModal(false);
        setNewUserData({
          firstName: '',
          lastName: '',
          email: '',
          role: '',
          numberPhone:'',
          password: '',
          confirmPassword: ''
        });
      })
      .catch(err => {
        alert(err.message || "Erreur lors du chargement des utilisateurs.");
      });

    // Fermer le modal
    setShowAddUserModal(false);
  };

  // Supprimer un utilisateur
  const handleDeleteUser = (userId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      api.delete(`user/delete/${userId}`)
        .then(() => {
          setUsers(users.filter(user => user.id !== userId));
        })
        .catch(err => {
          alert(err.message || "Erreur lors de la suppression de l'utilisateur.");
        });
    }
  };
  
  return (
    <>
      <div className="dashboard-row">
        <div className="card card-span-17">
          <div className="card-header">
            <h2 className="card-title">
              <i className="fas fa-users card-title-icon"></i>
              Gestion des utilisateurs
            </h2>
            <button className="btn btn-success" onClick={() => setShowAddUserModal(true)}>
              <i className="fas fa-user-plus btn-icon"></i>
              Ajouter un utilisateur
            </button>
          </div>
          <div className="card-body">
            <div className="responsive-table" style={{ overflowX: 'auto', width: '100%' }}>
              <table className="user-list">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th>numberPhone</th>
                    <th>Dernière connexion</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.lastName + ' ' + user.firstName}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`user-role-badge ${getRoleBadgeClass(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge status-${user.status}`}></span>
                        {user.status === true ? 'Actif' : 'Inactif'}
                      </td>
                      <td>{user.numberPhone}</td>
                      <td>{user.updatedAt}</td>
                      <td>
                        <div className="user-actions">
                          <button className="action-btn edit-btn" onClick={() => handleOpenEditModal(user)}><i className="fas fa-edit"></i></button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer">
            <div>Affichage de {users.length} utilisateurs</div>
            <div>
              <button className="btn btn-primary">Voir tous les utilisateurs</button>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <div className={`modal ${showAddUserModal ? 'show' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">Ajouter un utilisateur</h3>
            <button className="modal-close" onClick={() => setShowAddUserModal(false)}>&times;</button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Prénom</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Merveille"
                name="firstName"
                value={newUserData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Nom</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: ALLADATIN"
                name="lastName"
                value={newUserData.lastName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="Ex: jean.dupont@neosafe.fr"
                name="email"
                value={newUserData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Rôle</label>
              <select
                className="form-select"
                name="role"
                value={newUserData.role}
                onChange={handleInputChange}
              >
                <option value="">Sélectionner un rôle</option>
                <option value="admin">Administrateur</option>
                <option value="doctor">Médecin</option>
                <option value="nurse">Infirmier(ère)</option>
                <option value="parent">Parent</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Phone number</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: 0154000000"
                name="numberPhone"
                value={newUserData.numberPhone}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mot de passe temporaire</label>
              <input
                type="password"
                className="form-input"
                name="password"
                value={newUserData.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirmer le mot de passe</label>
              <input
                type="password"
                className="form-input"
                name="confirmPassword"
                value={newUserData.confirmPassword}
                onChange={handleInputChange}
              />

            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-danger" onClick={() => setShowAddUserModal(false)}>Annuler</button>
            <button className="btn btn-success" onClick={handleAddUser}>Ajouter l'utilisateur</button>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      <div className={`modal ${showEditUserModal ? 'show' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">Modifier l'utilisateur</h3>
            <button className="modal-close" onClick={() => setShowEditUserModal(false)}>&times;</button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Prénom</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Merveille"
                name="firstName"
                value={editingUser?.firstName}
                onChange={handleEditInputChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Nom</label>
              <input
                type="text"
                className="form-input"
                placeholder="ALLADATIN"
                name="lastName"
                value={editingUser?.lastName}
                onChange={handleEditInputChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="Ex: jean.dupont@neosafe.fr"
                name="email"
                value={editingUser?.email}
                onChange={handleEditInputChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Rôle</label>
              <select
                className="form-select"
                name="role"
                value={editingUser?.role}
                onChange={handleEditInputChange}
              >
                <option value="">Sélectionner un rôle</option>
                <option value="admin">Administrateur</option>
                <option value="doctor">Médecin</option>
                <option value="nurse">Infirmier(ère)</option>
                <option value="parent">Parent</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <input
                type="password"
                className="form-input"
                name="password"
                placeholder="Laisser vide si inchangé"
                value={editingUser?.password}
                onChange={handleEditInputChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirmer le mot de passe</label>
              <input
                type="password"
                className="form-input"
                name="confirmPassword"
                placeholder="Laisser vide si inchangé"
                value={editingUser?.confirmPassword}
                onChange={handleEditInputChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Statut</label>
              <div className="status-toggle">
                <span className={editingUser?.status === 'active' ? 'active-text' : 'inactive-text'}>
                  {editingUser?.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
                <button
                  type="button"
                  className={`toggle-btn ${editingUser?.status === 'active' ? 'active' : 'inactive'}`}
                  onClick={toggleUserStatus}
                >
                  <span className="toggle-slider"></span>
                </button>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-danger" onClick={() => setShowEditUserModal(false)}>Annuler</button>
            <button className="btn btn-success" onClick={handleUpdateUser}>Mettre à jour l'utilisateur</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserManagement; 
