```typescript
import { z } from 'zod';

export enum NotificationType {
  // Existing notification types...
  
  // Production notifications
  PRODUCTION_ASSIGNED = 'production_assigned',
  PRODUCTION_COMPLETED = 'production_completed',
  PRODUCTION_ON_HOLD = 'production_on_hold',
  QA_REQUIRED = 'qa_required',
  QA_FAILED = 'qa_failed'
}

// Rest of the file remains unchanged...
```