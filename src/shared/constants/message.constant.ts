export const SuccessMessageConstant = {
  EntityCreated: (entityName: string) => `${entityName} created successfully`,
  EntityUpdated: (entityName: string) => `${entityName} updated successfully`,
  EntityDeleted: (entityName: string) => `${entityName} deleted successfully`,
  EntityRetrieved: (entityName: string) =>
    `${entityName} retrieved successfully`,
  EntitiesRetrieved: (entityName: string) =>
    `${entityName} retrieved successfully`,

  Action: (action: string) => `${action} successfully`,
} as const;

export const ErrorMessageConstant = {
  UnprocessableEntity: 'Unprocessable Entity',
  Unauthorized: 'Not Authorized',
  ForbiddenAccess: 'Forbidden Access',
  NotFound: 'Not Found',
  InternalServerError: 'Internal Server Error',
  BadRequest: 'Bad Request',
  Conflict: 'Conflict',
  TooManyRequests: 'Too Many Requests',
  ValidationError: 'Validation Error',
  FieldRequired: 'Field Required',
  FieldRequiredWithName: (fieldName: string) =>
    `Field ${fieldName} is required`,
  FieldInvalidValue: 'Field Invalid Value',
  FieldInvalidValueWithName: (fieldName: string, expectedType?: string) =>
    `Field ${fieldName} has an invalid value${expectedType ? `, expected ${expectedType}` : ''}`,
  FieldMinLength: (fieldName: string, length: number) =>
    `${fieldName} must be at least ${length} characters`,
  FieldExactLength: (fieldName: string, length: number) =>
    `${fieldName} must be exactly ${length} character${length > 1 ? 's' : ''}`,
  FieldArrayMinLength: (fieldName: string, length: number) =>
    `${fieldName} must contain at least ${length} item${length > 1 ? 's' : ''}`,
  FieldMustBePositive: (fieldName: string) => `${fieldName} must be positive`,
  FieldInvalidFormat: (fieldName: string, format: string) =>
    `${fieldName} must be in format ${format}`,
  QueryError: 'Query Error',
  DataNotFound: 'Data Not Found',
  DataEntityNotFound: (entityName: string) => `Data ${entityName} not found`,
  DataEntityFieldAlreadyExists: (entityName: string, fieldName: string) =>
    `Data ${entityName} with ${fieldName} already exists`,
  DataEntityFieldNotFound: (entityName: string, fieldName: string) =>
    `Data ${entityName} with ${fieldName} not found`,
  FieldDuplicate: 'Field Duplicate',
  FieldDuplicateWithName: (fieldName: string) =>
    `Field ${fieldName} is duplicate`,
  DataNotDeleted: 'Error, Data not deleted',
  DataEntityReferencedByOther: (entityName: string, referencedBy: string) =>
    `Data ${entityName} is referenced by ${referencedBy}`,
  DataEntityInInvalidState: (entityName: string, state: string) =>
    `Data ${entityName} is ${state}`,
  DataEntityDoesNotHaveRequiredAttribute: (params: {
    entityName: string;
    identifier: string;
    requiredAttribute: string;
    context: string;
  }) =>
    `Data ${params.entityName} ${params.identifier} does not have the required ${params.requiredAttribute} for ${params.context}`,

  /**
   * Error messages related to auth operations
   */
  InvalidCredentials: 'Invalid credentials',

  /**
   * Error messages related to user passwords
   */
  PasswordTooWeak:
    'Password too weak, must contain at least one uppercase letter, one lowercase letter, and one number',
  PasswordTooShort: (length = 8) =>
    `Password must be at least ${length} characters long`,

  /**
   * Error message related to email
   */
  InvalidEmailFormat: 'Invalid email format',

  /**
   * Error message related to JWT tokens
   */
  InvalidOrExpiredToken: 'Invalid or expired token',
} as const;
