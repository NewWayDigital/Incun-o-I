import React, { useRef } from 'react';
import { 
  Card, CardContent, Typography, Button, Box, Divider, Grid, 
  Paper, Stack, Table, TableBody, TableCell, TableRow, IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function OrdonnanceDetails({ ordonnance, onBack }) {
  const printRef = useRef();

  // Format the date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Handle print functionality
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Ordonnance_${ordonnance.id || 'nouvelle'}`,
    onBeforeGetContent: () => {
      // Any preparation before printing
    },
    onAfterPrint: () => {
      // Any cleanup after printing
    }
  });

  if (!ordonnance) {
    return (
      <Card className="dashboard-card">
        <CardContent>
          <Typography variant="h5" color="error">
            Ordonnance non trouvée
          </Typography>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={onBack}
            sx={{ mt: 2 }}
          >
            Retour
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dashboard-card">
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={onBack}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" component="h2">
              Détails de l'ordonnance
            </Typography>
          </Stack>
          <Button 
            variant="outlined" 
            startIcon={<PrintIcon />} 
            onClick={handlePrint}
          >
            Imprimer
          </Button>
        </Box>

        <Box ref={printRef} sx={{ p: 2 }}>
          {/* Header for printing - visible only when printing */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              mb: 4,
              '@media print': { display: 'flex' },
              '@media screen': { display: 'none' } 
            }}
          >
            <Typography variant="h4" gutterBottom>ORDONNANCE MÉDICALE</Typography>
            <Divider sx={{ width: '100%', mb: 2 }} />
          </Box>

          {/* Main content */}
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Informations générales</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold', border: 'none' }}>
                        Date
                      </TableCell>
                      <TableCell sx={{ border: 'none' }}>
                        {formatDate(ordonnance.date)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold', border: 'none' }}>
                        Patient
                      </TableCell>
                      <TableCell sx={{ border: 'none' }}>
                        {ordonnance.patient}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold', border: 'none' }}>
                        Médecin
                      </TableCell>
                      <TableCell sx={{ border: 'none' }}>
                        {ordonnance.medecin}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold', border: 'none' }}>
                        Statut
                      </TableCell>
                      <TableCell sx={{ border: 'none' }}>
                        <Box 
                          component="span" 
                          sx={{ 
                            px: 1, 
                            py: 0.5, 
                            borderRadius: 1,
                            backgroundColor: ordonnance.statut === 'active' ? 'success.light' : 'info.light',
                            color: ordonnance.statut === 'active' ? 'success.dark' : 'info.dark'
                          }}
                        >
                          {ordonnance.statut === 'active' ? 'Active' : 'Terminée'}
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Médicaments</Typography>
            <Divider sx={{ mb: 2 }} />
            
            {ordonnance.medicaments && ordonnance.medicaments.map((med, index) => (
              <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: index < ordonnance.medicaments.length - 1 ? '1px dashed #e0e0e0' : 'none' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      {med.nom}
                    </Typography>
                    <Typography variant="body2">
                      Dosage: {med.dosage}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      Fréquence: {med.frequence}
                    </Typography>
                    <Typography variant="body2">
                      Durée: {med.duree}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}

            {(!ordonnance.medicaments || ordonnance.medicaments.length === 0) && (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Aucun médicament prescrit
              </Typography>
            )}
          </Paper>

          {ordonnance.notes && (
            <Paper elevation={0} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Notes et instructions</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {ordonnance.notes}
              </Typography>
            </Paper>
          )}

          {/* Footer for printing - visible only when printing */}
          <Box 
            sx={{ 
              mt: 6, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              '@media print': { display: 'flex' },
              '@media screen': { display: 'none' } 
            }}
          >
            <Divider sx={{ width: '100%', mb: 2 }} />
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              Signature du médecin:
            </Typography>
            <Box sx={{ height: 60 }} />
            <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 4 }}>
              Cette ordonnance est valable jusqu'au: {ordonnance.date ? 
                formatDate(new Date(new Date(ordonnance.date).setMonth(new Date(ordonnance.date).getMonth() + 3))) : 
                '(non spécifié)'}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default OrdonnanceDetails; 