import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Chip,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Study } from '@/types';

// Mock data
const mockStudies: Study[] = [
  {
    id: '1',
    title: 'COVID-19 Vaccine Efficacy Study',
    description: 'A randomized controlled trial to assess vaccine effectiveness',
    objectives: ['Measure vaccine efficacy', 'Monitor side effects'],
    criteria: {
      inclusionCriteria: ['Age 18-65', 'Healthy individuals'],
      exclusionCriteria: ['Pregnancy', 'Immunocompromised'],
      ageRange: { min: 18, max: 65 },
      gender: 'any',
      conditions: [],
    },
    status: 'active',
    createdBy: 'Dr. Smith',
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-28T00:00:00Z',
    enrollmentCount: 45,
    targetEnrollment: 100,
  },
  {
    id: '2',
    title: 'Diabetes Management Study',
    description: 'Evaluating new glucose monitoring techniques',
    objectives: ['Compare monitoring methods', 'Assess patient satisfaction'],
    criteria: {
      inclusionCriteria: ['Type 2 diabetes', 'Age 40+'],
      exclusionCriteria: ['Type 1 diabetes'],
      ageRange: { min: 40, max: 80 },
      gender: 'any',
      conditions: ['Type 2 Diabetes'],
    },
    status: 'active',
    createdBy: 'Dr. Johnson',
    createdAt: '2025-01-10T00:00:00Z',
    updatedAt: '2025-01-27T00:00:00Z',
    enrollmentCount: 32,
    targetEnrollment: 50,
  },
  {
    id: '3',
    title: 'Hypertension Treatment Protocol',
    description: 'Comparing different treatment approaches for hypertension',
    objectives: ['Evaluate treatment effectiveness', 'Monitor blood pressure changes'],
    criteria: {
      inclusionCriteria: ['Diagnosed hypertension', 'Age 30-70'],
      exclusionCriteria: ['Secondary hypertension'],
      ageRange: { min: 30, max: 70 },
      gender: 'any',
      conditions: ['Hypertension'],
    },
    status: 'draft',
    createdBy: 'Dr. Williams',
    createdAt: '2025-01-20T00:00:00Z',
    updatedAt: '2025-01-25T00:00:00Z',
    enrollmentCount: 0,
    targetEnrollment: 80,
  },
];

const StudyList: React.FC = () => {
  const navigate = useNavigate();
  const [studies, setStudies] = useState<Study[]>(mockStudies);
  const [filteredStudies, setFilteredStudies] = useState<Study[]>(mockStudies);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const filtered = studies.filter(
      (study) =>
        study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        study.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        study.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudies(filtered);
    setPage(0);
  }, [searchTerm, studies]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, study: Study) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudy(study);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStudy(null);
  };

  const handleDelete = () => {
    if (selectedStudy) {
      setStudies(studies.filter((s) => s.id !== selectedStudy.id));
      setDeleteDialogOpen(false);
      handleMenuClose();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'draft':
        return 'warning';
      case 'completed':
        return 'info';
      case 'paused':
        return 'secondary';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Research Studies
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/studies/create')}
          size="large"
        >
          Create New Study
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search studies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="studies table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Enrollment</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudies
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((study) => (
                <TableRow
                  key={study.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Box>
                      <Typography variant="subtitle2" component="div">
                        {study.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {study.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={study.status}
                      color={getStatusColor(study.status) as any}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>{study.createdBy}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PeopleIcon fontSize="small" />
                      {study.enrollmentCount}/{study.targetEnrollment}
                    </Box>
                  </TableCell>
                  <TableCell>{formatDate(study.createdAt)}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, study)}
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredStudies.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            if (selectedStudy) {
              navigate(`/studies/${selectedStudy.id}`);
              handleMenuClose();
            }
          }}
        >
          <VisibilityIcon sx={{ mr: 1 }} fontSize="small" />
          View Details
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedStudy) {
              navigate(`/studies/${selectedStudy.id}/matches`);
              handleMenuClose();
            }
          }}
        >
          <PeopleIcon sx={{ mr: 1 }} fontSize="small" />
          Patient Matches
        </MenuItem>
        <MenuItem
          onClick={() => {
            // Navigate to edit page
            handleMenuClose();
          }}
        >
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Edit Study
        </MenuItem>
        <MenuItem
          onClick={() => {
            setDeleteDialogOpen(true);
            handleMenuClose();
          }}
        >
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Delete Study
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Study</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{selectedStudy?.title}"? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudyList;
