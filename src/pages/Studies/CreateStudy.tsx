import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateStudyRequest } from '@/types';

const studySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  objectives: z.array(z.string().min(1, 'Objective cannot be empty')),
  criteria: z.object({
    inclusionCriteria: z.array(z.string().min(1, 'Inclusion criterion cannot be empty')),
    exclusionCriteria: z.array(z.string().min(1, 'Exclusion criterion cannot be empty')),
    ageRange: z.object({
      min: z.number().min(0, 'Minimum age must be 0 or greater'),
      max: z.number().max(120, 'Maximum age cannot exceed 120'),
    }),
    gender: z.enum(['male', 'female', 'any']),
    conditions: z.array(z.string()),
    medications: z.array(z.string()).optional(),
  }),
});

type StudyFormData = z.infer<typeof studySchema>;

const CreateStudy: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentCondition, setCurrentCondition] = useState('');
  const [currentMedication, setCurrentMedication] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<StudyFormData>({
    resolver: zodResolver(studySchema),
    defaultValues: {
      title: '',
      description: '',
      objectives: [''],
      criteria: {
        inclusionCriteria: [''],
        exclusionCriteria: [''],
        ageRange: { min: 18, max: 65 },
        gender: 'any',
        conditions: [],
        medications: [],
      },
    },
  });

  const {
    fields: objectiveFields,
    append: appendObjective,
    remove: removeObjective,
  } = useFieldArray({
    control,
    name: 'objectives',
  });

  const {
    fields: inclusionFields,
    append: appendInclusion,
    remove: removeInclusion,
  } = useFieldArray({
    control,
    name: 'criteria.inclusionCriteria',
  });

  const {
    fields: exclusionFields,
    append: appendExclusion,
    remove: removeExclusion,
  } = useFieldArray({
    control,
    name: 'criteria.exclusionCriteria',
  });

  const conditions = watch('criteria.conditions') || [];
  const medications = watch('criteria.medications') || [];

  const addCondition = () => {
    if (currentCondition.trim()) {
      setValue('criteria.conditions', [...conditions, currentCondition.trim()]);
      setCurrentCondition('');
    }
  };

  const removeCondition = (index: number) => {
    setValue('criteria.conditions', conditions.filter((_, i) => i !== index));
  };

  const addMedication = () => {
    if (currentMedication.trim()) {
      setValue('criteria.medications', [...(medications || []), currentMedication.trim()]);
      setCurrentMedication('');
    }
  };

  const removeMedication = (index: number) => {
    setValue('criteria.medications', (medications || []).filter((_, i) => i !== index));
  };

  const onSubmit = async (data: StudyFormData) => {
    setIsLoading(true);
    try {
      // Here you would typically call your API
      console.log('Creating study:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to studies list
      navigate('/studies');
    } catch (error) {
      console.error('Error creating study:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/studies')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Create New Study
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Study Title"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>

            {/* Objectives */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Study Objectives
              </Typography>
            </Grid>

            {objectiveFields.map((field, index) => (
              <Grid item xs={12} key={field.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Controller
                    name={`objectives.${index}`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label={`Objective ${index + 1}`}
                        error={!!errors.objectives?.[index]}
                        helperText={errors.objectives?.[index]?.message}
                      />
                    )}
                  />
                  {objectiveFields.length > 1 && (
                    <IconButton onClick={() => removeObjective(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button
                startIcon={<AddIcon />}
                onClick={() => appendObjective('')}
                variant="outlined"
              >
                Add Objective
              </Button>
            </Grid>

            {/* Study Criteria */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Study Criteria
              </Typography>
            </Grid>

            {/* Age Range */}
            <Grid item xs={6}>
              <Controller
                name="criteria.ageRange.min"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Minimum Age"
                    type="number"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    error={!!errors.criteria?.ageRange?.min}
                    helperText={errors.criteria?.ageRange?.min?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="criteria.ageRange.max"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Maximum Age"
                    type="number"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    error={!!errors.criteria?.ageRange?.max}
                    helperText={errors.criteria?.ageRange?.max?.message}
                  />
                )}
              />
            </Grid>

            {/* Gender */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Controller
                  name="criteria.gender"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Gender">
                      <MenuItem value="any">Any</MenuItem>
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            {/* Submit Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/studies')}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Study'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateStudy;
