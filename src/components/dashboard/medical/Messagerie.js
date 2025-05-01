import React, { useState } from 'react';
import '../../../styles/dashboard/Components.css';
import '../../../styles/dashboard/Messagerie.css';

function Messagerie() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Données des conversations
  const conversationsData = [
    {
      id: 1,
      contact: {
        nom: 'Dr. Thomas Dubois',
        role: 'Pédiatre',
        avatar: 'T'
      },
      messages: [
        {
          id: 1,
          sender: 'them',
          text: 'Bonjour Dr. Martin, avez-vous vu les derniers résultats d\'Emma Martin ?',
          time: '10:30',
          date: 'Aujourd\'hui'
        },
        {
          id: 2,
          sender: 'me',
          text: 'Bonjour Dr. Dubois, oui je les ai vus. Les paramètres vitaux se sont stabilisés.',
          time: '10:35',
          date: 'Aujourd\'hui'
        },
        {
          id: 3,
          sender: 'them',
          text: 'Parfait ! Je passerai la voir cet après-midi.',
          time: '10:38',
          date: 'Aujourd\'hui'
        }
      ],
      unread: 0,
      lastMessage: {
        text: 'Parfait ! Je passerai la voir cet après-midi.',
        time: '10:38',
        date: 'Aujourd\'hui'
      }
    },
    {
      id: 2,
      contact: {
        nom: 'Mme Claire Dupont',
        role: 'Parent',
        avatar: 'C'
      },
      messages: [
        {
          id: 1,
          sender: 'them',
          text: 'Bonjour docteur, comment va Lucas aujourd\'hui ?',
          time: '09:15',
          date: 'Aujourd\'hui'
        },
        {
          id: 2,
          sender: 'me',
          text: 'Bonjour Mme Dupont. Lucas se porte mieux, sa température est revenue à la normale.',
          time: '09:30',
          date: 'Aujourd\'hui'
        },
        {
          id: 3,
          sender: 'them',
          text: 'C\'est une excellente nouvelle ! Est-ce que je peux venir le voir cet après-midi ?',
          time: '09:32',
          date: 'Aujourd\'hui'
        }
      ],
      unread: 2,
      lastMessage: {
        text: 'C\'est une excellente nouvelle ! Est-ce que je peux venir le voir cet après-midi ?',
        time: '09:32',
        date: 'Aujourd\'hui'
      }
    },
    {
      id: 3,
      contact: {
        nom: 'Dr. Sophie Laurent',
        role: 'Infirmière chef',
        avatar: 'S'
      },
      messages: [
        {
          id: 1,
          sender: 'them',
          text: 'L\'incubateur C3 signale une alerte d\'humidité basse.',
          time: '08:45',
          date: 'Hier'
        },
        {
          id: 2,
          sender: 'me',
          text: 'Merci pour l\'information. Pouvez-vous ajuster les paramètres ?',
          time: '08:50',
          date: 'Hier'
        },
        {
          id: 3,
          sender: 'them',
          text: 'C\'est fait. Je surveille l\'évolution.',
          time: '08:55',
          date: 'Hier'
        }
      ],
      unread: 0,
      lastMessage: {
        text: 'C\'est fait. Je surveille l\'évolution.',
        time: '08:55',
        date: 'Hier'
      }
    }
  ];
  
  // Filtrer les conversations selon le terme de recherche
  const filteredConversations = conversationsData.filter(conv => {
    if (!searchTerm) return true;
    return conv.contact.nom.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Obtenir les messages de la conversation sélectionnée
  const currentChat = selectedChat ? 
    conversationsData.find(conv => conv.id === selectedChat) : null;
  
  // Envoyer un message
  const sendMessage = () => {
    if (messageText.trim() === '' || !currentChat) return;
    
    // Dans une application réelle, vous enverriez le message à l'API
    console.log(`Message envoyé à ${currentChat.contact.nom}: ${messageText}`);
    
    // Réinitialiser le champ de texte
    setMessageText('');
  };
  
  return (
    <div className="main-content" id="main-content">
      <div className="topbar">
        <h1 className="page-title">Messagerie</h1>
      </div>
      <div className="dashboard-content">
        <h2 className="section-title">Messagerie</h2>
        
        <div className="messagerie-container">
          <div className="contacts-sidebar">
            <div className="contacts-header">
              <div className="search-container">
                <i className="fas fa-search search-icon"></i>
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn btn-icon new-message-btn">
                <i className="fas fa-edit"></i>
              </button>
            </div>
            
            <div className="contacts-list">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => (
                  <div 
                    key={conv.id} 
                    className={`contact-item ${selectedChat === conv.id ? 'active' : ''}`}
                    onClick={() => setSelectedChat(conv.id)}
                  >
                    <div className="contact-avatar">
                      {conv.contact.avatar}
                    </div>
                    <div className="contact-info">
                      <div className="contact-name">{conv.contact.nom}</div>
                      <div className="contact-role">{conv.contact.role}</div>
                      <div className="last-message">{conv.lastMessage.text}</div>
                    </div>
                    <div className="contact-meta">
                      <div className="message-time">{conv.lastMessage.time}</div>
                      {conv.unread > 0 && (
                        <div className="unread-badge">{conv.unread}</div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-contacts">
                  <i className="fas fa-search"></i>
                  <p>Aucun contact trouvé</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="chat-container">
            {currentChat ? (
              <>
                <div className="chat-header">
                  <div className="chat-contact">
                    <div className="contact-avatar">{currentChat.contact.avatar}</div>
                    <div className="contact-info">
                      <div className="contact-name">{currentChat.contact.nom}</div>
                      <div className="contact-role">{currentChat.contact.role}</div>
                    </div>
                  </div>
                  <div className="chat-actions">
                    <button className="btn btn-icon" title="Appel vidéo">
                      <i className="fas fa-video"></i>
                    </button>
                    <button className="btn btn-icon" title="Appel audio">
                      <i className="fas fa-phone"></i>
                    </button>
                    <button className="btn btn-icon" title="Plus d'options">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                  </div>
                </div>
                
                <div className="chat-messages">
                  {currentChat.messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.sender === 'me' ? 'sent' : 'received'}`}>
                      <div className="message-content">
                        <div className="message-text">{msg.text}</div>
                        <div className="message-time">{msg.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="chat-input">
                  <button className="btn btn-icon" title="Joindre un fichier">
                    <i className="fas fa-paperclip"></i>
                  </button>
                  <input 
                    type="text" 
                    placeholder="Écrivez votre message..." 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') sendMessage();
                    }}
                  />
                  <button 
                    className="btn btn-icon send-btn" 
                    title="Envoyer"
                    onClick={sendMessage}
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </>
            ) : (
              <div className="no-chat-selected">
                <i className="fas fa-comments"></i>
                <p>Sélectionnez une conversation pour commencer</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messagerie; 