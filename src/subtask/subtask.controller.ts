import { Controller } from '@nestjs/common';
import { SubtaskService } from './subtask.service';

@Controller('subtask')
export class SubtaskController {
    constructor(private readonly subtaskService: SubtaskService) {}
}
