export enum StatusEffectType {
  DEFENDED,
}

export type StatusEffect = {
  id: number;
  type: StatusEffectType;
  // Количество "раундов" активности эффекта
  duration: number;
  amount: number;
  // Раунд в котором статус обрабатывался в последний раз, чтобы можно было отыграть несколько статусов в один заход.
  round?: number;
};
