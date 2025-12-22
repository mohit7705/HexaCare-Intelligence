import React from 'react';
import { useForm } from 'react-hook-form';
import { HeartRiskInput, RiskResult } from '../types';
import { assessRisk } from '../services/api';
import { Loader2, Heart } from 'lucide-react';

interface Props {
  setResult: (r: RiskResult) => void;
  setIsLoading: (b: boolean) => void;
  isLoading: boolean;
}

const HeartRiskForm: React.FC<Props> = ({
  setResult,
  setIsLoading,
  isLoading,
}) => {
  const { register, handleSubmit } = useForm<HeartRiskInput>();

  const onSubmit = async (data: HeartRiskInput) => {
    setIsLoading(true);
    try {
      const payload: HeartRiskInput = {
        userEmail: 'user@hexacare.ai',
        ...data,
      };

      const result = await assessRisk(payload);
      setResult(result);
    } catch {
      alert('Heart risk analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register('age')} type="number" placeholder="Age" required />
      <input {...register('systolic_bp')} type="number" placeholder="Systolic BP" required />
      <input {...register('diastolic_bp')} type="number" placeholder="Diastolic BP" required />
      <input {...register('cholesterol')} type="number" placeholder="Cholesterol" required />
      <input {...register('heart_rate')} type="number" placeholder="Heart Rate" required />

      <label><input type="checkbox" {...register('is_smoker')} /> Smoker</label>
      <label><input type="checkbox" {...register('is_diabetic')} /> Diabetic</label>
      <label><input type="checkbox" {...register('family_history')} /> Family History</label>

      <button disabled={isLoading}>
        {isLoading ? <Loader2 className="animate-spin" /> : <Heart />}
        Calculate Risk
      </button>
    </form>
  );
};

export default HeartRiskForm;
