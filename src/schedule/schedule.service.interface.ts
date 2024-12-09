export abstract class ScheduleServiceAbstract {
  abstract handleCron(): void;
  abstract processJob(): void;
}
