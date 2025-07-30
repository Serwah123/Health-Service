import { Response } from 'express';
import { MockDataService } from '@/services/mockDataService.js';
import { ApiResponse, PatientMatch } from '@/types/index.js';

export class MatchController {
  static async findMatches(req: any, res: Response): Promise<void> {
    try {
      const { studyId } = req.validatedParams;
      const { criteria } = req.validatedData;

      const study = await MockDataService.getStudyById(studyId);
      if (!study) {
        res.status(404).json({
          success: false,
          message: 'Study not found',
        } as ApiResponse);
        return;
      }

      const matches = await MockDataService.findPatientMatches(studyId, criteria);

      res.json({
        success: true,
        data: matches,
        message: 'Patient matches found successfully',
      } as ApiResponse<PatientMatch[]>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to find patient matches',
      } as ApiResponse);
    }
  }

  static async getMatchById(req: any, res: Response): Promise<void> {
    try {
      const { id } = req.validatedParams;

      const match = await MockDataService.getMatchById(id);
      if (!match) {
        res.status(404).json({
          success: false,
          message: 'Match not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: match,
        message: 'Match retrieved successfully',
      } as ApiResponse<PatientMatch>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve match',
      } as ApiResponse);
    }
  }

  static async updateMatchStatus(req: any, res: Response): Promise<void> {
    try {
      const { id } = req.validatedParams;
      const { status, notes } = req.validatedData;

      const updatedMatch = await MockDataService.updateMatchStatus(id, status, notes);
      if (!updatedMatch) {
        res.status(404).json({
          success: false,
          message: 'Match not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: updatedMatch,
        message: 'Match status updated successfully',
      } as ApiResponse<PatientMatch>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update match status',
      } as ApiResponse);
    }
  }

  static async getMatchHistory(req: any, res: Response): Promise<void> {
    try {
      const { id } = req.validatedParams;

      const match = await MockDataService.getMatchById(id);
      if (!match) {
        res.status(404).json({
          success: false,
          message: 'Match not found',
        } as ApiResponse);
        return;
      }

      // Mock match history - in a real application, this would come from an audit log
      const history = [
        {
          id: 'hist-1',
          matchId: id,
          action: 'created',
          timestamp: match.createdAt,
          details: 'Match initially identified',
        },
        {
          id: 'hist-2',
          matchId: id,
          action: 'status_change',
          timestamp: match.updatedAt,
          details: `Status changed to ${match.status}`,
        },
      ];

      res.json({
        success: true,
        data: history,
        message: 'Match history retrieved successfully',
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve match history',
      } as ApiResponse);
    }
  }

  static async exportMatches(req: any, res: Response): Promise<void> {
    try {
      const { studyId } = req.validatedParams;
      const { format = 'json' } = req.query;

      const study = await MockDataService.getStudyById(studyId);
      if (!study) {
        res.status(404).json({
          success: false,
          message: 'Study not found',
        } as ApiResponse);
        return;
      }

      const matches = await MockDataService.findPatientMatches(studyId);

      if (format === 'csv') {
        // Convert to CSV format
        const csvHeader = 'Match ID,Patient ID,Score,Status,Created At,Updated At\n';
        const csvRows = matches.map(match => 
          `${match.id},${match.patientId},${match.matchScore},${match.status},${match.createdAt},${match.updatedAt}`
        ).join('\n');
        
        const csvData = csvHeader + csvRows;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="study-${studyId}-matches.csv"`);
        res.send(csvData);
      } else {
        // JSON format
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="study-${studyId}-matches.json"`);
        res.json({
          success: true,
          data: {
            studyId,
            studyTitle: study.title,
            exportedAt: new Date().toISOString(),
            matches,
          },
          message: 'Matches exported successfully',
        } as ApiResponse);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to export matches',
      } as ApiResponse);
    }
  }
}
