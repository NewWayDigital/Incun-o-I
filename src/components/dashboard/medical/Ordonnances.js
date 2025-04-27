import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Button, 
  Box, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton, Tooltip,
  Dialog, DialogActions, DialogContent, DialogContentText, 
  DialogTitle, TextField, InputAdornment, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import OrdonnancesFormulaire from './OrdonnancesFormulaire';
import OrdonnanceDetails from './OrdonnanceDetails';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Sample data - replace with actual API calls in production
const sampleOrdonnances = [
  {
    id: 1,
    date: '2023-05-15T10:30:00',
    patient: 'Kokou ABALO',
    medecin: 'Dr. Koffi AGBOBLI',
    medicaments: [
      { nom: 'Paracétamol', dosage: '500mg', frequence: '3 fois par jour', duree: '5 jours' },
      { nom: 'Ibuprofène', dosage: '400mg', frequence: '2 fois par jour', duree: '3 jours' }
    ],
    notes: 'Prendre après les repas. Boire beaucoup d\'eau.',
    statut: 'active'
  },
  {
    id: 2,
    date: '2023-05-10T14:45:00',
    patient: 'Ama ADODO',
    medecin: 'Dr. Koffi AGBOBLI',
    medicaments: [
      { nom: 'Amoxicilline', dosage: '500mg', frequence: '2 fois par jour', duree: '7 jours' }
    ],
    notes: 'Finir tout le traitement antibiotique.',
    statut: 'completed'
  }
];

function Ordonnances() {
  const [ordonnances, setOrdonnances] = useState([]);
  const [filteredOrdonnances, setFilteredOrdonnances] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [openFormModal, setOpenFormModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentOrdonnance, setCurrentOrdonnance] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'form', 'detail'
  
  // Fetch ordonnances data
  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    
    // Replace with actual API call
    const fetchData = async () => {
      try {
        // const response = await fetch('/api/ordonnances');
        // const data = await response.json();
        // setOrdonnances(data);
        
        // Using sample data for now
        setTimeout(() => {
          setOrdonnances(sampleOrdonnances);
          setFilteredOrdonnances(sampleOrdonnances);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError('Erreur lors du chargement des ordonnances');
        setIsLoading(false);
        console.error('Error fetching ordonnances:', err);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter ordonnances when search term or status filter changes
  useEffect(() => {
    if (!ordonnances) return;
    
    const filtered = ordonnances.filter(ordonnance => {
      const matchesSearch = 
        ordonnance.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ordonnance.medecin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ordonnance.medicaments && ordonnance.medicaments.some(med => 
          med.nom.toLowerCase().includes(searchTerm.toLowerCase())
        ));
      
      const matchesStatus = 
        statusFilter === 'all' || 
        ordonnance.statut === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredOrdonnances(filtered);
  }, [ordonnances, searchTerm, statusFilter]);
  
  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch (err) {
      console.error('Error formatting date:', err);
      return dateString;
    }
  };
  
  // Handle adding new ordonnance
  const handleAddOrdonnance = () => {
    setCurrentOrdonnance(null);
    setViewMode('form');
  };
  
  // Handle editing ordonnance
  const handleEditOrdonnance = (ordonnance) => {
    setCurrentOrdonnance(ordonnance);
    setViewMode('form');
  };
  
  // Handle viewing ordonnance details
  const handleViewOrdonnance = (ordonnance) => {
    setCurrentOrdonnance(ordonnance);
    setViewMode('detail');
  };
  
  // Handle opening delete confirmation dialog
  const handleDeleteConfirmOpen = (ordonnance) => {
    setCurrentOrdonnance(ordonnance);
    setOpenDeleteModal(true);
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      // Replace with actual API call
      // await fetch(`/api/ordonnances/${currentOrdonnance.id}`, {
      //   method: 'DELETE'
      // });
      
      // Update local state
      const updatedOrdonnances = ordonnances.filter(o => o.id !== currentOrdonnance.id);
      setOrdonnances(updatedOrdonnances);
      setFilteredOrdonnances(
        filteredOrdonnances.filter(o => o.id !== currentOrdonnance.id)
      );
      
      setOpenDeleteModal(false);
    } catch (err) {
      console.error('Error deleting ordonnance:', err);
      setError('Erreur lors de la suppression de l\'ordonnance');
    }
  };
  
  // Handle form submission (create/update)
  const handleFormSubmit = async (formData) => {
    try {
      if (currentOrdonnance) {
        // Update existing ordonnance
        // Replace with actual API call
        // await fetch(`/api/ordonnances/${currentOrdonnance.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData)
        // });
        
        // Update local state
        const updatedOrdonnances = ordonnances.map(o => 
          o.id === currentOrdonnance.id ? { ...formData, id: currentOrdonnance.id } : o
        );
        setOrdonnances(updatedOrdonnances);
      } else {
        // Create new ordonnance
        // Replace with actual API call
        // const response = await fetch('/api/ordonnances', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData)
        // });
        // const newOrdonnance = await response.json();
        
        // Simulate creating new ordonnance with ID
        const newOrdonnance = {
          ...formData,
          id: ordonnances.length > 0 
            ? Math.max(...ordonnances.map(o => o.id)) + 1 
            : 1
        };
        
        // Update local state
        setOrdonnances([...ordonnances, newOrdonnance]);
      }
      
      // Return to list view
      setViewMode('list');
    } catch (err) {
      console.error('Error saving ordonnance:', err);
      setError('Erreur lors de l\'enregistrement de l\'ordonnance');
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <Card className="dashboard-card">
        <CardContent>
          <Typography>Chargement des ordonnances...</Typography>
        </CardContent>
      </Card>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Card className="dashboard-card">
        <CardContent>
          <Typography color="error">{error}</Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Render form view
  if (viewMode === 'form') {
    return (
      <OrdonnancesFormulaire 
        ordonnance={currentOrdonnance} 
        onSubmit={handleFormSubmit}
        onCancel={() => setViewMode('list')}
      />
    );
  }
  
  // Render detail view
  if (viewMode === 'detail') {
    return (
      <OrdonnanceDetails 
        ordonnance={currentOrdonnance}
        onBack={() => setViewMode('list')} 
      />
    );
  }
  
  // Render list view (default)
  return (
    <Card className="dashboard-card">
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h2">
            Gestion des Ordonnances
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleAddOrdonnance}
          >
            Nouvelle Ordonnance
          </Button>
        </Box>
        
        <Box display="flex" justifyContent="space-between" mb={3}>
          <TextField
            placeholder="Rechercher..."
            variant="outlined"
            size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          
          <Box>
            <Tooltip title="Filtrer par statut">
              <IconButton 
                color={statusFilter !== 'all' ? 'primary' : 'default'}
                onClick={() => {
                  // Cycle through filter options
                  if (statusFilter === 'all') setStatusFilter('active');
                  else if (statusFilter === 'active') setStatusFilter('completed');
                  else setStatusFilter('all');
                }}
              >
                <FilterListIcon />
              </IconButton>
            </Tooltip>
            {statusFilter !== 'all' && (
              <Chip 
                label={statusFilter === 'active' ? 'Actives' : 'Terminées'} 
                color={statusFilter === 'active' ? 'success' : 'info'}
                onDelete={() => setStatusFilter('all')}
                size="small"
                sx={{ ml: 1 }}
              />
            )}
          </Box>
        </Box>
        
        <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Médecin</TableCell>
                <TableCell>Médicaments</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrdonnances.length > 0 ? (
                filteredOrdonnances.map((ordonnance) => (
                  <TableRow key={ordonnance.id}>
                    <TableCell>{formatDate(ordonnance.date)}</TableCell>
                    <TableCell>{ordonnance.patient}</TableCell>
                    <TableCell>{ordonnance.medecin}</TableCell>
                    <TableCell>
                      {ordonnance.medicaments && ordonnance.medicaments.length > 0 ? (
                        <Tooltip title={ordonnance.medicaments.map(med => med.nom).join(', ')}>
                          <span>{ordonnance.medicaments.length} médicament(s)</span>
                        </Tooltip>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Aucun
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={ordonnance.statut === 'active' ? 'Active' : 'Terminée'} 
                        color={ordonnance.statut === 'active' ? 'success' : 'info'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Voir détails">
                        <IconButton 
                          size="small"
                          onClick={() => handleViewOrdonnance(ordonnance)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton 
                          size="small"
                          onClick={() => handleEditOrdonnance(ordonnance)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton 
                          size="small"
                          color="error"
                          onClick={() => handleDeleteConfirmOpen(ordonnance)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      Aucune ordonnance trouvée
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Typography variant="body2" color="text.secondary">
            Total: {filteredOrdonnances.length} ordonnance(s)
          </Typography>
        </Box>
      </CardContent>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cette ordonnance ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)}>
            Annuler
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default Ordonnances; 