import { describe, it, expect, beforeEach, vi } from 'vitest';
import { todoApi, ApiError } from '../api';
import type { CreateTodoRequest, UpdateTodoRequest } from '../../types/todo';

// Mock fetch globally
global.fetch = vi.fn();

describe('todoApi - Negative Scenarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Error Handling', () => {
    it('should throw ApiError when API returns 404', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          message: 'Todo not found',
          statusCode: 404,
          traceId: 'test-trace-id',
        }),
      });

      // Act & Assert
      await expect(todoApi.getById(999)).rejects.toThrow(ApiError);
      await expect(todoApi.getById(999)).rejects.toThrow('Todo not found');
    });

    it('should throw ApiError when API returns 400 for validation errors', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          message: 'Validation failed',
          statusCode: 400,
          errors: {
            Title: ['Title is required'],
          },
        }),
      });

      const request: CreateTodoRequest = {
        title: '',
        priority: 1,
      };

      // Act & Assert
      await expect(todoApi.create(request)).rejects.toThrow(ApiError);
    });

    it('should throw ApiError when API returns 500', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          message: 'Internal server error',
          statusCode: 500,
        }),
      });

      // Act & Assert
      await expect(todoApi.getAll()).rejects.toThrow(ApiError);
    });

    it('should handle network failures', async () => {
      // Arrange
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      // Act & Assert
      await expect(todoApi.getAll()).rejects.toThrow('Network error');
    });

    it('should handle malformed JSON responses', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      // Act & Assert
      await expect(todoApi.getAll()).rejects.toThrow();
    });

    it('should include validation errors in ApiError', async () => {
      // Arrange
      const validationErrors = {
        Title: ['Title is required', 'Title must not exceed 200 characters'],
        Priority: ['Priority must be between 0 and 3'],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          message: 'Validation failed',
          statusCode: 400,
          errors: validationErrors,
          traceId: 'test-trace',
        }),
      });

      const request: CreateTodoRequest = {
        title: '',
        priority: 10,
      };

      // Act & Assert
      try {
        await todoApi.create(request);
        expect.fail('Should have thrown ApiError');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        if (error instanceof ApiError) {
          expect(error.errors).toEqual(validationErrors);
          expect(error.statusCode).toBe(400);
          expect(error.traceId).toBe('test-trace');
        }
      }
    });
  });

  describe('DELETE operation', () => {
    it('should handle 404 when deleting non-existent todo', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          message: 'Todo with ID 999 not found',
          statusCode: 404,
        }),
      });

      // Act & Assert
      await expect(todoApi.delete(999)).rejects.toThrow('Todo with ID 999 not found');
    });

    it('should handle successful deletion with 204 No Content', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => {
          throw new Error('Should not try to parse JSON for 204');
        },
      });

      // Act
      const result = await todoApi.delete(1);

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('UPDATE operation', () => {
    it('should handle 404 when updating non-existent todo', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          message: 'Todo with ID 999 not found',
          statusCode: 404,
        }),
      });

      const updateRequest: UpdateTodoRequest = {
        title: 'Updated Title',
      };

      // Act & Assert
      await expect(todoApi.update(999, updateRequest)).rejects.toThrow(
        'Todo with ID 999 not found'
      );
    });
  });

  describe('TOGGLE operation', () => {
    it('should handle 404 when toggling non-existent todo', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          message: 'Todo with ID 999 not found',
          statusCode: 404,
        }),
      });

      // Act & Assert
      await expect(todoApi.toggleComplete(999)).rejects.toThrow(
        'Todo with ID 999 not found'
      );
    });
  });

  describe('Query Parameters', () => {
    it('should build correct URL with filter parameters', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [],
      });

      // Act
      await todoApi.getAll(true, 2);

      // Assert
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('isCompleted=true')
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('priority=2')
      );
    });

    it('should handle empty results', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [],
      });

      // Act
      const result = await todoApi.getAll();

      // Assert
      expect(result).toEqual([]);
    });
  });
});
