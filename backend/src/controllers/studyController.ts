import { Request, Response } from 'express';
import { MockDataService } from '@/services/mockDataService.js';
import { Utils } from '@/utils/helpers.js';
import { ApiResponse, PaginatedResponse, Study, StudyStats } from '@/types/index.js';

export class StudyController {
  static async getAllStudies(req: any, res: Response): Promise<void> {
    try {
      const { page = 1, pageSize = 10 } = req.validatedQuery || {};
      const { q, status, createdBy } = req.query;

      let studies = await MockDataService.getAllStudies();

      // Apply filters
      if (q) {
        const searchTerm = q.toLowerCase();
        studies = studies.filter(study =>
          study.title.toLowerCase().includes(searchTerm) ||
          study.description.toLowerCase().includes(searchTerm)
        );
      }

      if (status) {
        studies = studies.filter(study => study.status === status);
      }

      if (createdBy) {
        studies = studies.filter(study => study.createdBy === createdBy);
      }

      // Paginate results
      const paginatedResult = Utils.paginate(studies, page, pageSize);

      res.json({
        success: true,
        data: paginatedResult.data,
        pagination: paginatedResult.pagination,
        message: 'Studies retrieved successfully',
      } as ApiResponse<Study[]> & { pagination: any });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve studies',
      } as ApiResponse);
    }
  }

  static async getStudyById(req: any, res: Response): Promise<void> {
    try {
      const { id } = req.validatedParams;

      const study = await MockDataService.getStudyById(id);
      if (!study) {
        res.status(404).json({
          success: false,
          message: 'Study not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: study,
        message: 'Study retrieved successfully',
      } as ApiResponse<Study>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve study',
      } as ApiResponse);
    }
  }

  static async createStudy(req: any, res: Response): Promise<void> {
    try {
      const studyData = req.validatedData;
      const userId = req.user?.id;

      const newStudy = await MockDataService.createStudy(studyData, userId);

      res.status(201).json({
        success: true,
        data: newStudy,
        message: 'Study created successfully',
      } as ApiResponse<Study>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create study',
      } as ApiResponse);
    }
  }

  static async updateStudy(req: any, res: Response): Promise<void> {
    try {
      const { id } = req.validatedParams;
      const updateData = req.validatedData;

      const updatedStudy = await MockDataService.updateStudy(id, updateData);
      if (!updatedStudy) {
        res.status(404).json({
          success: false,
          message: 'Study not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: updatedStudy,
        message: 'Study updated successfully',
      } as ApiResponse<Study>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update study',
      } as ApiResponse);
    }
  }

  static async deleteStudy(req: any, res: Response): Promise<void> {
    try {
      const { id } = req.validatedParams;

      const deleted = await MockDataService.deleteStudy(id);
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Study not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        message: 'Study deleted successfully',
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete study',
      } as ApiResponse);
    }
  }

  static async getStudyStats(req: any, res: Response): Promise<void> {
    try {
      const { id } = req.validatedParams;

      const study = await MockDataService.getStudyById(id);
      if (!study) {
        res.status(404).json({
          success: false,
          message: 'Study not found',
        } as ApiResponse);
        return;
      }

      // Generate mock stats for the specific study
      const stats = {
        enrollmentCount: study.enrollmentCount,
        targetEnrollment: study.targetEnrollment,
        enrollmentRate: (study.enrollmentCount / study.targetEnrollment) * 100,
        status: study.status,
        createdDate: study.createdAt,
        lastUpdated: study.updatedAt,
        totalForms: Math.floor(Math.random() * 10) + 1,
        completedForms: Math.floor(Math.random() * 5) + 1,
      };

      res.json({
        success: true,
        data: stats,
        message: 'Study statistics retrieved successfully',
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve study statistics',
      } as ApiResponse);
    }
  }

  static async getPatientMatches(req: any, res: Response): Promise<void> {
    try {
      const { id } = req.validatedParams;

      const study = await MockDataService.getStudyById(id);
      if (!study) {
        res.status(404).json({
          success: false,
          message: 'Study not found',
        } as ApiResponse);
        return;
      }

      const matches = await MockDataService.findPatientMatches(id);

      res.json({
        success: true,
        data: matches,
        message: 'Patient matches retrieved successfully',
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve patient matches',
      } as ApiResponse);
    }
  }
}
