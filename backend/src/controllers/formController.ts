import { Response } from 'express';
import { MockDataService } from '@/services/mockDataService.js';
import { Utils } from '@/utils/helpers.js';
import { ApiResponse, FormTemplate, FormResponse } from '@/types/index.js';

export class FormController {
  static async getAllForms(req: any, res: Response): Promise<void> {
    try {
      const { page = 1, pageSize = 10 } = req.validatedQuery || {};
      const { studyId, type, status } = req.query;

      let forms = await MockDataService.getAllForms();

      // Apply filters
      if (studyId) {
        forms = forms.filter(form => form.studyId === studyId);
      }

      if (type) {
        forms = forms.filter(form => form.type === type);
      }

      if (status) {
        forms = forms.filter(form => form.status === status);
      }

      // Paginate results
      const paginatedResult = Utils.paginate(forms, page, pageSize);

      res.json({
        success: true,
        data: paginatedResult.data,
        pagination: paginatedResult.pagination,
        message: 'Forms retrieved successfully',
      } as ApiResponse<FormTemplate[]> & { pagination: any });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve forms',
      } as ApiResponse);
    }
  }

  static async getFormById(req: any, res: Response): Promise<void> {
    try {
      const { id } = req.validatedParams;

      const form = await MockDataService.getFormById(id);
      if (!form) {
        res.status(404).json({
          success: false,
          message: 'Form not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: form,
        message: 'Form retrieved successfully',
      } as ApiResponse<FormTemplate>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve form',
      } as ApiResponse);
    }
  }

  static async createForm(req: any, res: Response): Promise<void> {
    try {
      const formData = req.validatedData;
      const userId = req.user?.id;

      const newForm = await MockDataService.createForm(formData, userId);

      res.status(201).json({
        success: true,
        data: newForm,
        message: 'Form created successfully',
      } as ApiResponse<FormTemplate>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create form',
      } as ApiResponse);
    }
  }

  static async updateForm(req: any, res: Response): Promise<void> {
    try {
      const { id } = req.validatedParams;
      const updateData = req.validatedData;

      const updatedForm = await MockDataService.updateForm(id, updateData);
      if (!updatedForm) {
        res.status(404).json({
          success: false,
          message: 'Form not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: updatedForm,
        message: 'Form updated successfully',
      } as ApiResponse<FormTemplate>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update form',
      } as ApiResponse);
    }
  }

  static async deleteForm(req: any, res: Response): Promise<void> {
    try {
      const { id } = req.validatedParams;

      const deleted = await MockDataService.deleteForm(id);
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Form not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        message: 'Form deleted successfully',
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete form',
      } as ApiResponse);
    }
  }

  static async getFormResponses(req: any, res: Response): Promise<void> {
    try {
      const { id } = req.validatedParams;
      const { page = 1, pageSize = 10 } = req.validatedQuery || {};

      const form = await MockDataService.getFormById(id);
      if (!form) {
        res.status(404).json({
          success: false,
          message: 'Form not found',
        } as ApiResponse);
        return;
      }

      const responses = await MockDataService.getFormResponses(id);
      const paginatedResult = Utils.paginate(responses, page, pageSize);

      res.json({
        success: true,
        data: paginatedResult.data,
        pagination: paginatedResult.pagination,
        message: 'Form responses retrieved successfully',
      } as ApiResponse<FormResponse[]> & { pagination: any });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve form responses',
      } as ApiResponse);
    }
  }

  static async submitFormResponse(req: any, res: Response): Promise<void> {
    try {
      const { id } = req.validatedParams;
      const responseData = req.validatedData;
      const userId = req.user?.id;

      const form = await MockDataService.getFormById(id);
      if (!form) {
        res.status(404).json({
          success: false,
          message: 'Form not found',
        } as ApiResponse);
        return;
      }

      const response = await MockDataService.submitFormResponse(id, responseData, userId);

      res.status(201).json({
        success: true,
        data: response,
        message: 'Form response submitted successfully',
      } as ApiResponse<FormResponse>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to submit form response',
      } as ApiResponse);
    }
  }

  static async validateFormSchema(req: any, res: Response): Promise<void> {
    try {
      const { schema } = req.validatedData;

      // Basic JSON Schema validation
      const isValid = Utils.validateJsonSchema(schema);

      res.json({
        success: true,
        data: { isValid },
        message: isValid ? 'Schema is valid' : 'Schema validation failed',
      } as ApiResponse<{ isValid: boolean }>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to validate schema',
      } as ApiResponse);
    }
  }
}
