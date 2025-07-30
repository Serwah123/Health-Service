import { Response } from 'express';
import { MockDataService } from '@/services/mockDataService.js';
import { Utils } from '@/utils/helpers.js';
import { ApiResponse, Patient, PatientMatch } from '@/types/index.js';

export class PatientController {
  static async getAllPatients(req: any, res: Response): Promise<void> {
    try {
      const { page = 1, pageSize = 10 } = req.validatedQuery || {};
      const { q, age, gender, condition } = req.query;

      let patients = await MockDataService.getAllPatients();

      // Apply filters
      if (q) {
        const searchTerm = q.toLowerCase();
        patients = patients.filter(patient =>
          patient.firstName.toLowerCase().includes(searchTerm) ||
          patient.lastName.toLowerCase().includes(searchTerm) ||
          patient.email.toLowerCase().includes(searchTerm)
        );
      }

      if (age) {
        const ageNum = parseInt(age as string);
        patients = patients.filter(patient => patient.age === ageNum);
      }

      if (gender) {
        patients = patients.filter(patient => patient.gender === gender);
      }

      if (condition) {
        patients = patients.filter(patient =>
          patient.medicalHistory.some(record =>
            record.condition.toLowerCase().includes((condition as string).toLowerCase())
          )
        );
      }

      // Paginate results
      const paginatedResult = Utils.paginate(patients, page, pageSize);

      res.json({
        success: true,
        data: paginatedResult.data,
        pagination: paginatedResult.pagination,
        message: 'Patients retrieved successfully',
      } as ApiResponse<Patient[]> & { pagination: any });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve patients',
      } as ApiResponse);
    }
  }

  static async getPatientById(req: any, res: Response): Promise<void> {
    try {
      const { id } = req.validatedParams;

      const patient = await MockDataService.getPatientById(id);
      if (!patient) {
        res.status(404).json({
          success: false,
          message: 'Patient not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: patient,
        message: 'Patient retrieved successfully',
      } as ApiResponse<Patient>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve patient',
      } as ApiResponse);
    }
  }

  static async createPatient(req: any, res: Response): Promise<void> {
    try {
      const patientData = req.validatedData;

      const newPatient = await MockDataService.createPatient(patientData);

      res.status(201).json({
        success: true,
        data: newPatient,
        message: 'Patient created successfully',
      } as ApiResponse<Patient>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create patient',
      } as ApiResponse);
    }
  }

  static async updatePatient(req: any, res: Response): Promise<void> {
    try {
      const { id } = req.validatedParams;
      const updateData = req.validatedData;

      const updatedPatient = await MockDataService.updatePatient(id, updateData);
      if (!updatedPatient) {
        res.status(404).json({
          success: false,
          message: 'Patient not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: updatedPatient,
        message: 'Patient updated successfully',
      } as ApiResponse<Patient>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update patient',
      } as ApiResponse);
    }
  }

  static async deletePatient(req: any, res: Response): Promise<void> {
    try {
      const { id } = req.validatedParams;

      const deleted = await MockDataService.deletePatient(id);
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Patient not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        message: 'Patient deleted successfully',
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete patient',
      } as ApiResponse);
    }
  }

  static async searchPatients(req: any, res: Response): Promise<void> {
    try {
      const { criteria } = req.validatedData;

      const matches = await MockDataService.searchPatients(criteria);

      res.json({
        success: true,
        data: matches,
        message: 'Patient search completed successfully',
      } as ApiResponse<PatientMatch[]>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to search patients',
      } as ApiResponse);
    }
  }

  static async getPatientMedicalHistory(req: any, res: Response): Promise<void> {
    try {
      const { id } = req.validatedParams;

      const patient = await MockDataService.getPatientById(id);
      if (!patient) {
        res.status(404).json({
          success: false,
          message: 'Patient not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: patient.medicalHistory,
        message: 'Medical history retrieved successfully',
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve medical history',
      } as ApiResponse);
    }
  }
}
