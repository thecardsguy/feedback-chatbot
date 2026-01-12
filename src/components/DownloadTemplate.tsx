/**
 * Download Template Component
 * Creates a downloadable ZIP file containing all essential template files
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  Loader2,
  FileArchive,
  Check,
  Folder,
  File,
  ExternalLink,
} from 'lucide-react';

// Template file structure preview
const FILE_STRUCTURE = [
  { name: 'src/feedback/', type: 'folder', desc: 'Widget components & hooks' },
  { name: 'src/feedback/index.ts', type: 'file', desc: 'Main exports' },
  { name: 'src/feedback/QuickStart.tsx', type: 'file', desc: 'Drop-in widget' },
  { name: 'src/feedback/types/feedback.ts', type: 'file', desc: 'TypeScript types' },
  { name: 'src/feedback/config/feedback.config.ts', type: 'file', desc: 'Configuration presets' },
  { name: 'src/feedback/hooks/useFeedback.ts', type: 'file', desc: 'Data hooks' },
  { name: 'src/feedback/components/user/', type: 'folder', desc: 'User-facing components' },
  { name: 'src/feedback/components/admin/', type: 'folder', desc: 'Admin dashboard' },
  { name: 'supabase/functions/', type: 'folder', desc: 'Backend edge functions' },
  { name: 'database-setup.sql', type: 'file', desc: 'Database schema' },
  { name: 'README.md', type: 'file', desc: 'Setup instructions' },
];

export function DownloadTemplate() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const generateAndDownloadZip = async () => {
    setIsGenerating(true);
    
    try {
      // Dynamically import JSZip
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // ==========================================
      // src/feedback/index.ts
      // ==========================================
      zip.file('src/feedback/index.ts', `/**
 * Feedback Widget Template - Main Export
 */

// Quick Start (recommended for new users)
export { FeedbackWidget } from './QuickStart';

// Types
export * from './types/feedback';

// Config
export * from './config/feedback.config';

// Hooks
export * from './hooks/useFeedback';

// User Components
export { FeedbackButton } from './components/user/FeedbackButton';
export { FeedbackForm } from './components/user/FeedbackForm';
export { ElementPicker } from './components/user/ElementPicker';

// Admin Components
export { FeedbackDashboard } from './components/admin/FeedbackDashboard';
export { FeedbackList } from './components/admin/FeedbackList';
export { FeedbackDetail } from './components/admin/FeedbackDetail';
export { FeedbackStats } from './components/admin/FeedbackStats';
`);

      // ==========================================
      // src/feedback/QuickStart.tsx
      // ==========================================
      zip.file('src/feedback/QuickStart.tsx', `/**
 * Feedback Widget - Quick Start Component
 * 
 * A single component that provides the complete feedback widget experience
 * with zero configuration required. Just drop this into your app.
 */

import React from 'react';
import { FeedbackButton } from './components/user/FeedbackButton';
import { createConfig } from './config/feedback.config';
import type { WidgetTier } from './types/feedback';

export interface FeedbackWidgetProps {
  appName?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  enableAI?: boolean;
  showElementPicker?: boolean;
  buttonColor?: string;
  onSubmit?: (feedbackId: string) => void;
  onError?: (error: Error) => void;
}

export function FeedbackWidget({
  appName = 'My App',
  position = 'bottom-right',
  enableAI = false,
  showElementPicker = true,
  buttonColor,
  onSubmit,
  onError,
}: FeedbackWidgetProps) {
  const tier: WidgetTier = enableAI ? 'pro' : 'standard';
  
  const config = createConfig(
    {
      appName,
      position,
      buttonColor,
      features: {
        elementPicker: showElementPicker,
        categories: true,
        severityLevels: true,
        anonymousSubmission: true,
      },
      ai: {
        enabled: enableAI,
        provider: enableAI ? 'lovable' : undefined,
        summarize: enableAI,
        categorize: enableAI,
        generateDevPrompt: enableAI,
      },
      onSuccess: onSubmit ? (item) => onSubmit(item.id) : undefined,
      onError: onError,
    },
    tier
  );

  return <FeedbackButton config={config} />;
}

export { useFeedback } from './hooks/useFeedback';
export { createConfig } from './config/feedback.config';

export default FeedbackWidget;
`);

      // ==========================================
      // src/feedback/types/feedback.ts
      // ==========================================
      zip.file('src/feedback/types/feedback.ts', `/**
 * Feedback Widget Template - Type Definitions
 */

export type FeedbackCategory = 'bug' | 'feature' | 'ui_ux' | 'suggestion' | 'other';
export type FeedbackSeverity = 'low' | 'medium' | 'high' | 'critical';
export type FeedbackStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface TargetElement {
  selector: string;
  tagName: string;
  className: string;
  textPreview: string;
  boundingBox?: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

export interface FeedbackItem {
  id: string;
  user_id?: string;
  raw_text: string;
  category: FeedbackCategory;
  severity: FeedbackSeverity;
  page_url?: string;
  target_element?: TargetElement;
  ai_summary?: string;
  ai_category?: FeedbackCategory;
  ai_question_for_dev?: string;
  device_type?: DeviceType;
  context?: Record<string, unknown>;
  status: FeedbackStatus;
  created_at: string;
  updated_at: string;
}

export type WidgetPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
export type WidgetTier = 'basic' | 'standard' | 'pro';

export interface CustomCategory {
  id: string;
  label: string;
  icon?: string;
  color?: string;
}

export interface FeedbackConfig {
  appName: string;
  position: WidgetPosition;
  buttonColor?: string;
  buttonIcon?: 'message' | 'bug' | 'lightbulb' | 'help';
  features: {
    elementPicker: boolean;
    categories: boolean;
    severityLevels: boolean;
    anonymousSubmission: boolean;
  };
  ai: {
    enabled: boolean;
    provider?: 'lovable' | 'openai';
    demoMode?: boolean;
    summarize: boolean;
    categorize: boolean;
    generateDevPrompt: boolean;
  };
  admin: {
    showStats: boolean;
    copyToClipboard: boolean;
    exportEnabled: boolean;
    statusUpdates: boolean;
  };
  categories?: CustomCategory[];
  onSubmit?: (feedback: FeedbackSubmission) => void;
  onError?: (error: Error) => void;
  onSuccess?: (feedback: FeedbackItem) => void;
}

export interface FeedbackSubmission {
  raw_text: string;
  category?: FeedbackCategory;
  severity?: FeedbackSeverity;
  page_url?: string;
  target_element?: TargetElement;
  context?: Record<string, unknown>;
}

export interface FeedbackButtonProps {
  config: FeedbackConfig;
  className?: string;
}

export interface FeedbackFormProps {
  config: FeedbackConfig;
  onSubmit: (data: FeedbackSubmission) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export interface ElementPickerProps {
  isActive: boolean;
  onSelect: (element: TargetElement) => void;
  onCancel: () => void;
}

export interface FeedbackDashboardProps {
  config: FeedbackConfig;
}

export interface FeedbackListProps {
  items: FeedbackItem[];
  onSelect: (item: FeedbackItem) => void;
  selectedId?: string;
  isLoading?: boolean;
}

export interface FeedbackDetailProps {
  item: FeedbackItem;
  config: FeedbackConfig;
  onStatusChange?: (status: FeedbackStatus) => void;
  onClose: () => void;
}

export interface FeedbackStatsProps {
  items: FeedbackItem[];
}

export interface UseFeedbackReturn {
  items: FeedbackItem[];
  isLoading: boolean;
  error: Error | null;
  submit: (data: FeedbackSubmission) => Promise<FeedbackItem>;
  updateStatus: (id: string, status: FeedbackStatus) => Promise<void>;
  refresh: () => void;
}

export interface UseFeedbackStatsReturn {
  totalCount: number;
  byCategory: Record<FeedbackCategory, number>;
  bySeverity: Record<FeedbackSeverity, number>;
  byStatus: Record<FeedbackStatus, number>;
  recentTrend: 'up' | 'down' | 'stable';
}
`);

      // ==========================================
      // src/feedback/config/feedback.config.ts
      // ==========================================
      zip.file('src/feedback/config/feedback.config.ts', `/**
 * Feedback Widget Template - Configuration
 */

import type { FeedbackConfig, CustomCategory, WidgetTier } from '../types/feedback';

export const DEFAULT_CATEGORIES: CustomCategory[] = [
  { id: 'bug', label: 'Bug Report', icon: 'Bug', color: 'red' },
  { id: 'feature', label: 'Feature Request', icon: 'Lightbulb', color: 'blue' },
  { id: 'ui_ux', label: 'UI/UX Issue', icon: 'Palette', color: 'purple' },
  { id: 'suggestion', label: 'Suggestion', icon: 'MessageCircle', color: 'green' },
  { id: 'other', label: 'Other', icon: 'HelpCircle', color: 'gray' },
];

export const BASIC_PRESET: FeedbackConfig = {
  appName: 'My App',
  position: 'bottom-right',
  buttonIcon: 'message',
  features: {
    elementPicker: true,
    categories: true,
    severityLevels: false,
    anonymousSubmission: true,
  },
  ai: {
    enabled: false,
    summarize: false,
    categorize: false,
    generateDevPrompt: false,
  },
  admin: {
    showStats: false,
    copyToClipboard: false,
    exportEnabled: false,
    statusUpdates: false,
  },
  categories: DEFAULT_CATEGORIES,
};

export const STANDARD_PRESET: FeedbackConfig = {
  ...BASIC_PRESET,
  features: {
    ...BASIC_PRESET.features,
    severityLevels: true,
  },
  admin: {
    showStats: true,
    copyToClipboard: true,
    exportEnabled: true,
    statusUpdates: true,
  },
};

export const PRO_PRESET: FeedbackConfig = {
  ...STANDARD_PRESET,
  ai: {
    enabled: true,
    provider: 'lovable',
    summarize: true,
    categorize: true,
    generateDevPrompt: true,
  },
};

export function getPreset(tier: WidgetTier): FeedbackConfig {
  switch (tier) {
    case 'basic': return BASIC_PRESET;
    case 'standard': return STANDARD_PRESET;
    case 'pro': return PRO_PRESET;
    default: return BASIC_PRESET;
  }
}

export function createConfig(
  userConfig: Partial<FeedbackConfig>,
  baseTier: WidgetTier = 'basic'
): FeedbackConfig {
  const preset = getPreset(baseTier);
  
  return {
    ...preset,
    ...userConfig,
    features: { ...preset.features, ...userConfig.features },
    ai: { ...preset.ai, ...userConfig.ai },
    admin: { ...preset.admin, ...userConfig.admin },
    categories: userConfig.categories || preset.categories,
  };
}

export function validateConfig(config: FeedbackConfig): string[] {
  const errors: string[] = [];
  if (!config.appName || config.appName.trim() === '') {
    errors.push('appName is required');
  }
  if (config.ai.enabled && !config.ai.provider) {
    errors.push('AI provider must be specified when AI is enabled');
  }
  return errors;
}
`);

      // ==========================================
      // src/feedback/hooks/useFeedback.ts
      // ==========================================
      zip.file('src/feedback/hooks/useFeedback.ts', `/**
 * Feedback Widget Template - Data Hooks
 * 
 * IMPORTANT: Update the import path to match your Supabase client location
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client'; // UPDATE THIS PATH
import type {
  FeedbackItem,
  FeedbackSubmission,
  FeedbackStatus,
  FeedbackCategory,
  FeedbackSeverity,
  UseFeedbackReturn,
  UseFeedbackStatsReturn,
} from '../types/feedback';

interface FeedbackHookConfig {
  tableName?: string;
  aiEnabled?: boolean;
  userId?: string;
}

export function useFeedback(hookConfig: FeedbackHookConfig = {}): UseFeedbackReturn {
  const { aiEnabled = false, userId } = hookConfig;
  
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setItems((data || []) as unknown as FeedbackItem[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch feedback'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const submit = useCallback(async (data: FeedbackSubmission): Promise<FeedbackItem> => {
    const functionName = aiEnabled ? 'submit-feedback-ai' : 'submit-feedback';

    const { data: result, error: submitError } = await supabase.functions.invoke(
      functionName,
      {
        body: {
          ...data,
          user_id: userId,
          page_url: data.page_url || window.location.href,
          device_type: getDeviceType(),
        },
      }
    );

    if (submitError) throw submitError;
    await fetchItems();
    return result as FeedbackItem;
  }, [aiEnabled, userId, fetchItems]);

  const updateStatus = useCallback(async (id: string, status: FeedbackStatus): Promise<void> => {
    const { error: updateError } = await supabase
      .from('feedback')
      .update({ status, updated_at: new Date().toISOString() } as any)
      .eq('id', id);

    if (updateError) throw updateError;

    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status, updated_at: new Date().toISOString() } : item
      )
    );
  }, []);

  return {
    items,
    isLoading,
    error,
    submit,
    updateStatus,
    refresh: fetchItems,
  };
}

export function useFeedbackStats(items: FeedbackItem[]): UseFeedbackStatsReturn {
  return useMemo(() => {
    const byCategory: Record<FeedbackCategory, number> = {
      bug: 0, feature: 0, ui_ux: 0, suggestion: 0, other: 0,
    };
    const bySeverity: Record<FeedbackSeverity, number> = {
      low: 0, medium: 0, high: 0, critical: 0,
    };
    const byStatus: Record<FeedbackStatus, number> = {
      pending: 0, reviewed: 0, resolved: 0, dismissed: 0,
    };

    items.forEach(item => {
      if (byCategory[item.category] !== undefined) byCategory[item.category]++;
      if (bySeverity[item.severity] !== undefined) bySeverity[item.severity]++;
      if (byStatus[item.status] !== undefined) byStatus[item.status]++;
    });

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const recentCount = items.filter(item => new Date(item.created_at) >= weekAgo).length;
    const previousCount = items.filter(
      item => new Date(item.created_at) >= twoWeeksAgo && new Date(item.created_at) < weekAgo
    ).length;

    let recentTrend: 'up' | 'down' | 'stable' = 'stable';
    if (recentCount > previousCount * 1.2) recentTrend = 'up';
    else if (recentCount < previousCount * 0.8) recentTrend = 'down';

    return { totalCount: items.length, byCategory, bySeverity, byStatus, recentTrend };
  }, [items]);
}

export function useFeedbackFilters(items: FeedbackItem[]) {
  const [filters, setFilters] = useState<{
    category?: FeedbackCategory;
    severity?: FeedbackSeverity;
    status?: FeedbackStatus;
    search?: string;
  }>({});

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (filters.category && item.category !== filters.category) return false;
      if (filters.severity && item.severity !== filters.severity) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesText = item.raw_text.toLowerCase().includes(searchLower);
        const matchesSummary = item.ai_summary?.toLowerCase().includes(searchLower);
        if (!matchesText && !matchesSummary) return false;
      }
      return true;
    });
  }, [items, filters]);

  return {
    filteredItems,
    filters,
    setCategory: (category?: FeedbackCategory) => setFilters(f => ({ ...f, category })),
    setSeverity: (severity?: FeedbackSeverity) => setFilters(f => ({ ...f, severity })),
    setStatus: (status?: FeedbackStatus) => setFilters(f => ({ ...f, status })),
    setSearch: (search?: string) => setFilters(f => ({ ...f, search })),
    clearFilters: () => setFilters({}),
  };
}

function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}
`);

      // ==========================================
      // User Components (simplified for download)
      // ==========================================
      
      // Note: For the actual implementation, we direct users to the GitHub repo
      // These are placeholder stubs that indicate where the full implementation goes
      
      zip.file('src/feedback/components/user/FeedbackButton.tsx', `/**
 * Feedback Button Component
 * 
 * For the full implementation with animations and dark mode support,
 * see the complete source at: https://github.com/thecardsguy/feedback-chatbot
 * 
 * This is a simplified version. Copy the full file from the repo for production use.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { FeedbackForm } from './FeedbackForm';
import { useFeedback } from '../../hooks/useFeedback';
import type { FeedbackButtonProps, FeedbackSubmission, WidgetPosition } from '../../types/feedback';

const getPositionStyles = (position: WidgetPosition): React.CSSProperties => {
  const base: React.CSSProperties = { position: 'fixed', zIndex: 9999 };
  switch (position) {
    case 'bottom-right': return { ...base, bottom: 20, right: 20 };
    case 'bottom-left': return { ...base, bottom: 20, left: 20 };
    case 'top-right': return { ...base, top: 20, right: 20 };
    case 'top-left': return { ...base, top: 20, left: 20 };
    default: return { ...base, bottom: 20, right: 20 };
  }
};

export function FeedbackButton({ config, className }: FeedbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { submit } = useFeedback({ aiEnabled: config.ai?.enabled });

  const handleSubmit = useCallback(async (data: FeedbackSubmission) => {
    setIsSubmitting(true);
    try {
      if (config.onSubmit) config.onSubmit(data);
      const result = await submit(data);
      if (config.onSuccess) config.onSuccess(result);
      setShowSuccess(true);
      setTimeout(() => { setShowSuccess(false); setIsOpen(false); }, 2000);
    } catch (error) {
      if (config.onError) config.onError(error instanceof Error ? error : new Error('Submission failed'));
    } finally {
      setIsSubmitting(false);
    }
  }, [config, submit]);

  const buttonColor = config.buttonColor || '#3b82f6';

  return (
    <div style={getPositionStyles(config.position)} className={className}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 56, height: 56, borderRadius: '50%',
          backgroundColor: buttonColor, color: 'white',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute', bottom: 64, right: 0,
          width: 360, backgroundColor: 'white', borderRadius: 12,
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)', overflow: 'hidden',
        }}>
          {showSuccess ? (
            <div style={{ padding: 32, textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: '#22c55e' }}>Thank you!</div>
              <div style={{ fontSize: 14, color: '#6b7280' }}>Your feedback has been submitted.</div>
            </div>
          ) : (
            <FeedbackForm config={config} onSubmit={handleSubmit} onCancel={() => setIsOpen(false)} isSubmitting={isSubmitting} />
          )}
        </div>
      )}
    </div>
  );
}

export default FeedbackButton;
`);

      zip.file('src/feedback/components/user/FeedbackForm.tsx', `/**
 * Feedback Form Component
 * 
 * For the full implementation with animations and dark mode support,
 * see the complete source at: https://github.com/thecardsguy/feedback-chatbot
 */

import React, { useState } from 'react';
import { ElementPicker } from './ElementPicker';
import type { FeedbackFormProps, FeedbackSubmission, FeedbackCategory, FeedbackSeverity, TargetElement } from '../../types/feedback';

const CATEGORIES = [
  { value: 'bug' as const, label: 'Bug', emoji: '🐛' },
  { value: 'feature' as const, label: 'Feature', emoji: '✨' },
  { value: 'ui_ux' as const, label: 'Design', emoji: '🎨' },
  { value: 'suggestion' as const, label: 'Idea', emoji: '💡' },
  { value: 'other' as const, label: 'Other', emoji: '📝' },
];

export function FeedbackForm({ config, onSubmit, onCancel, isSubmitting }: FeedbackFormProps) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<FeedbackCategory>('other');
  const [severity, setSeverity] = useState<FeedbackSeverity>('medium');
  const [targetElement, setTargetElement] = useState<TargetElement | null>(null);
  const [isPickingElement, setIsPickingElement] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const submission: FeedbackSubmission = {
      raw_text: text.trim(),
      category: config.features.categories ? category : undefined,
      severity: config.features.severityLevels ? severity : undefined,
      target_element: targetElement || undefined,
      page_url: window.location.href,
    };

    await onSubmit(submission);
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Send Feedback</h3>
          <button type="button" onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>

        {config.features.categories && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
            {CATEGORIES.map(cat => (
              <button key={cat.value} type="button" onClick={() => setCategory(cat.value)}
                style={{
                  padding: 8, border: category === cat.value ? '2px solid #3b82f6' : '2px solid transparent',
                  borderRadius: 8, background: category === cat.value ? '#eff6ff' : '#f9fafb', cursor: 'pointer',
                }}>
                <span>{cat.emoji}</span>
              </button>
            ))}
          </div>
        )}

        <textarea
          value={text} onChange={e => setText(e.target.value.slice(0, 500))}
          placeholder="Describe your feedback..."
          style={{ width: '100%', padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, resize: 'none', minHeight: 100 }}
          required
        />

        {config.features.elementPicker && (
          <button type="button" onClick={() => setIsPickingElement(true)}
            style={{ padding: 12, border: '1px dashed #d1d5db', borderRadius: 8, background: 'transparent', cursor: 'pointer' }}>
            🎯 Target an element
          </button>
        )}

        <button type="submit" disabled={!text.trim() || isSubmitting}
          style={{
            padding: 12, border: 'none', borderRadius: 8,
            background: !text.trim() || isSubmitting ? '#e5e7eb' : '#3b82f6',
            color: 'white', fontWeight: 600, cursor: !text.trim() || isSubmitting ? 'not-allowed' : 'pointer',
          }}>
          {isSubmitting ? 'Sending...' : 'Submit'}
        </button>
      </form>

      <ElementPicker isActive={isPickingElement} onSelect={(el) => { setTargetElement(el); setIsPickingElement(false); }} onCancel={() => setIsPickingElement(false)} />
    </>
  );
}

export default FeedbackForm;
`);

      zip.file('src/feedback/components/user/ElementPicker.tsx', `/**
 * Element Picker Component
 * Allows users to visually select UI elements to target with their feedback.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { ElementPickerProps, TargetElement } from '../../types/feedback';

function generateSelector(element: HTMLElement): string {
  if (element.id) return \`#\${element.id}\`;
  const path: string[] = [];
  let current: HTMLElement | null = element;
  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase();
    if (current.className && typeof current.className === 'string') {
      const classes = current.className.split(' ').filter(c => c.trim()).slice(0, 2).join('.');
      if (classes) selector += \`.\${classes}\`;
    }
    path.unshift(selector);
    current = current.parentElement;
  }
  return path.join(' > ');
}

export function ElementPicker({ isActive, onSelect, onCancel }: ElementPickerProps) {
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-feedback-picker]')) return;
    setHoveredElement(target);
    setHighlightRect(target.getBoundingClientRect());
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as HTMLElement;
    if (target.closest('[data-feedback-picker]')) return;
    const elementData: TargetElement = {
      selector: generateSelector(target),
      tagName: target.tagName.toLowerCase(),
      className: target.className || '',
      textPreview: (target.textContent || '').slice(0, 100).trim(),
      boundingBox: {
        top: target.getBoundingClientRect().top,
        left: target.getBoundingClientRect().left,
        width: target.getBoundingClientRect().width,
        height: target.getBoundingClientRect().height,
      },
    };
    onSelect(elementData);
  }, [onSelect]);

  useEffect(() => {
    if (!isActive) return;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick, true);
    document.body.style.cursor = 'crosshair';
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.cursor = '';
    };
  }, [isActive, handleMouseMove, handleClick, onCancel]);

  if (!isActive) return null;

  return createPortal(
    <div data-feedback-picker="true">
      <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.1)', zIndex: 99998, pointerEvents: 'none' }} />
      {highlightRect && (
        <div style={{
          position: 'fixed', top: highlightRect.top - 2, left: highlightRect.left - 2,
          width: highlightRect.width + 4, height: highlightRect.height + 4,
          border: '2px solid #3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderRadius: 4, zIndex: 99999, pointerEvents: 'none',
        }} />
      )}
      <div style={{
        position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
        backgroundColor: '#1f2937', color: 'white', padding: '12px 24px',
        borderRadius: 8, zIndex: 100000, display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <span>Click on any element to select it</span>
        <button onClick={onCancel} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer' }}>
          Cancel (Esc)
        </button>
      </div>
    </div>,
    document.body
  );
}

export default ElementPicker;
`);

      // Admin components (simplified stubs)
      zip.file('src/feedback/components/admin/FeedbackDashboard.tsx', `/**
 * Feedback Dashboard - Admin Interface
 * 
 * For the full implementation, see: https://github.com/thecardsguy/feedback-chatbot
 */

import React, { useState, useCallback } from 'react';
import { FeedbackStats } from './FeedbackStats';
import { FeedbackList } from './FeedbackList';
import { FeedbackDetail } from './FeedbackDetail';
import { useFeedback, useFeedbackFilters } from '../../hooks/useFeedback';
import type { FeedbackDashboardProps, FeedbackItem, FeedbackStatus } from '../../types/feedback';

export function FeedbackDashboard({ config }: FeedbackDashboardProps) {
  const { items, isLoading, refresh, updateStatus } = useFeedback({ aiEnabled: config.ai.enabled });
  const { filteredItems, setSearch, clearFilters } = useFeedbackFilters(items);
  const [selectedItem, setSelectedItem] = useState<FeedbackItem | null>(null);

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
      <h1>Feedback Dashboard</h1>
      <p>{items.length} feedback items</p>
      
      {config.admin.showStats && <FeedbackStats items={items} />}
      
      <input
        type="text"
        placeholder="Search feedback..."
        onChange={e => setSearch(e.target.value || undefined)}
        style={{ padding: 8, border: '1px solid #e5e7eb', borderRadius: 4, marginBottom: 16 }}
      />
      
      <div style={{ display: 'grid', gridTemplateColumns: selectedItem ? '1fr 400px' : '1fr', gap: 24 }}>
        <FeedbackList items={filteredItems} onSelect={setSelectedItem} selectedId={selectedItem?.id} isLoading={isLoading} />
        {selectedItem && (
          <FeedbackDetail
            item={selectedItem}
            config={config}
            onStatusChange={status => updateStatus(selectedItem.id, status)}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </div>
    </div>
  );
}

export default FeedbackDashboard;
`);

      zip.file('src/feedback/components/admin/FeedbackList.tsx', `/**
 * Feedback List Component
 */

import React from 'react';
import type { FeedbackListProps } from '../../types/feedback';

export function FeedbackList({ items, onSelect, selectedId, isLoading }: FeedbackListProps & { showAIBadge?: boolean }) {
  if (isLoading) return <div>Loading...</div>;
  if (items.length === 0) return <div style={{ textAlign: 'center', padding: 48 }}>No feedback yet</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map(item => (
        <div
          key={item.id}
          onClick={() => onSelect(item)}
          style={{
            padding: 16, border: '1px solid', borderRadius: 8, cursor: 'pointer',
            borderColor: selectedId === item.id ? '#3b82f6' : '#e5e7eb',
            backgroundColor: selectedId === item.id ? '#f0f9ff' : 'white',
          }}
        >
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <span style={{ padding: '4px 8px', borderRadius: 4, fontSize: 11, backgroundColor: '#f3f4f6' }}>{item.category}</span>
            <span style={{ padding: '4px 8px', borderRadius: 4, fontSize: 11, backgroundColor: '#fef3c7' }}>{item.status}</span>
          </div>
          <div style={{ fontSize: 14, color: '#374151' }}>{item.ai_summary || item.raw_text}</div>
        </div>
      ))}
    </div>
  );
}

export default FeedbackList;
`);

      zip.file('src/feedback/components/admin/FeedbackDetail.tsx', `/**
 * Feedback Detail Component
 */

import React, { useState } from 'react';
import type { FeedbackDetailProps, FeedbackStatus } from '../../types/feedback';

export function FeedbackDetail({ item, config, onStatusChange, onClose }: FeedbackDetailProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(item.ai_question_for_dev || item.raw_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ padding: 24, backgroundColor: 'white', borderRadius: 8, border: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 style={{ margin: 0 }}>Feedback Details</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <strong>Category:</strong> {item.category} | <strong>Severity:</strong> {item.severity}
      </div>

      <div style={{ marginBottom: 16 }}>
        <strong>Original Feedback:</strong>
        <p>{item.raw_text}</p>
      </div>

      {item.ai_summary && (
        <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#faf5ff', borderRadius: 8 }}>
          <strong>AI Summary:</strong>
          <p>{item.ai_summary}</p>
        </div>
      )}

      {item.ai_question_for_dev && (
        <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#faf5ff', borderRadius: 8 }}>
          <strong>AI Question for Dev:</strong>
          <p>{item.ai_question_for_dev}</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        {onStatusChange && (
          <select value={item.status} onChange={e => onStatusChange(e.target.value as FeedbackStatus)}
            style={{ padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
        )}
        {config.admin.copyToClipboard && (
          <button onClick={copyToClipboard} style={{ padding: '8px 16px', backgroundColor: '#1f2937', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            {copied ? '✓ Copied!' : 'Copy as Prompt'}
          </button>
        )}
      </div>
    </div>
  );
}

export default FeedbackDetail;
`);

      zip.file('src/feedback/components/admin/FeedbackStats.tsx', `/**
 * Feedback Statistics Component
 */

import React from 'react';
import type { FeedbackStatsProps } from '../../types/feedback';
import { useFeedbackStats } from '../../hooks/useFeedback';

export function FeedbackStats({ items }: FeedbackStatsProps) {
  const stats = useFeedbackStats(items);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
      <div style={{ padding: 16, backgroundColor: 'white', borderRadius: 8, border: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>TOTAL</div>
        <div style={{ fontSize: 28, fontWeight: 700 }}>{stats.totalCount}</div>
      </div>
      <div style={{ padding: 16, backgroundColor: 'white', borderRadius: 8, border: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>PENDING</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#f97316' }}>{stats.byStatus.pending}</div>
      </div>
      <div style={{ padding: 16, backgroundColor: 'white', borderRadius: 8, border: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>RESOLVED</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#22c55e' }}>{stats.byStatus.resolved}</div>
      </div>
      <div style={{ padding: 16, backgroundColor: 'white', borderRadius: 8, border: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>CRITICAL</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#ef4444' }}>{stats.bySeverity.critical}</div>
      </div>
    </div>
  );
}

export default FeedbackStats;
`);

      // ==========================================
      // Edge Functions
      // ==========================================
      zip.file('supabase/functions/submit-feedback/index.ts', `import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  try {
    const payload = await req.json()
    
    if (!payload.raw_text || payload.raw_text.length < 5) {
      return new Response(JSON.stringify({ error: 'Feedback text is required (min 5 chars)' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    const context = {
      user_agent: req.headers.get('user-agent'),
      submitted_at: new Date().toISOString(),
    };

    const { data: feedback, error } = await supabase
      .from('feedback')
      .insert({
        raw_text: payload.raw_text.slice(0, 5000),
        category: payload.category || 'other',
        severity: payload.severity || 'medium',
        page_url: payload.page_url,
        target_element: payload.target_element,
        device_type: payload.device_type,
        status: 'pending',
        context,
      })
      .select('id, created_at')
      .single()

    if (error) throw error

    return new Response(JSON.stringify({ success: true, id: feedback.id }), { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: 'Failed to submit feedback' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
`);

      zip.file('supabase/functions/submit-feedback-ai/index.ts', `import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_TEXT_LENGTH = 5000;

interface FeedbackPayload {
  raw_text: string;
  category?: string;
  severity?: string;
  page_url?: string;
  target_element?: Record<string, unknown>;
  device_type?: string;
  demo_mode?: boolean;
}

// Demo mode mock responses
const DEMO_RESPONSES: Record<string, { summary: string; category: string; question: string }> = {
  bug: { summary: "User reports a bug that needs investigation.", category: "bug", question: "What specific steps led to this bug?" },
  feature: { summary: "User is requesting a new feature.", category: "feature_request", question: "How would this feature improve the experience?" },
  ui_ux: { summary: "User has identified a UI/UX issue.", category: "ux_issue", question: "Which element should be improved?" },
  suggestion: { summary: "User has provided a helpful suggestion.", category: "improvement", question: "How should this be prioritized?" },
  other: { summary: "User has provided general feedback.", category: "other", question: "What additional context would help?" },
};

function getDemoResponse(category: string) {
  const response = DEMO_RESPONSES[category] || DEMO_RESPONSES.other;
  return {
    ai_summary: \`[DEMO] \${response.summary}\`,
    ai_category: response.category,
    ai_question_for_dev: \`[DEMO] \${response.question}\`,
  };
}

async function enhanceWithAI(feedbackData: FeedbackPayload) {
  if (feedbackData.demo_mode) {
    return getDemoResponse(feedbackData.category || 'other');
  }

  const apiKey = Deno.env.get('LOVABLE_API_KEY');
  if (!apiKey) {
    return getDemoResponse(feedbackData.category || 'other');
  }

  try {
    const prompt = \`Analyze this user feedback and provide:
1. A brief summary (1-2 sentences)
2. A category (bug, feature_request, ux_issue, performance, documentation, other)
3. A question for the developer

Feedback: "\${feedbackData.raw_text}"

Respond in JSON: { "summary": "...", "category": "...", "question_for_dev": "..." }\`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': \`Bearer \${apiKey}\`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: 'You analyze user feedback. Respond with valid JSON.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) return getDemoResponse(feedbackData.category || 'other');

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;
    if (!content) return getDemoResponse(feedbackData.category || 'other');

    const jsonMatch = content.match(/\\{[\\s\\S]*\\}/);
    if (!jsonMatch) return getDemoResponse(feedbackData.category || 'other');

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      ai_summary: parsed.summary || null,
      ai_category: parsed.category || null,
      ai_question_for_dev: parsed.question_for_dev || null,
    };
  } catch (error) {
    console.error('AI error:', error);
    return getDemoResponse(feedbackData.category || 'other');
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  try {
    const payload = await req.json();
    
    if (!payload.raw_text || payload.raw_text.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Feedback text is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const isDemoMode = payload.demo_mode || !Deno.env.get('LOVABLE_API_KEY');
    const aiEnhancement = await enhanceWithAI(payload);

    const { data, error } = await supabase
      .from('feedback')
      .insert({
        raw_text: payload.raw_text.slice(0, MAX_TEXT_LENGTH),
        category: payload.category || 'other',
        severity: payload.severity || 'medium',
        page_url: payload.page_url,
        target_element: payload.target_element,
        device_type: payload.device_type,
        status: 'pending',
        context: { demo_mode: isDemoMode },
        ...aiEnhancement,
      })
      .select('id')
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, id: data.id, demo_mode: isDemoMode, ...aiEnhancement }), 
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
`);

      // ==========================================
      // Database Setup SQL
      // ==========================================
      zip.file('database-setup.sql', `-- Feedback Widget Template - Database Setup
-- Run this SQL in your Supabase SQL editor or use the migration tool

-- Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  raw_text TEXT NOT NULL,
  category TEXT DEFAULT 'other',
  severity TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  page_url TEXT,
  device_type TEXT,
  context JSONB,
  target_element JSONB,
  user_id UUID,
  ai_summary TEXT,
  ai_category TEXT,
  ai_question_for_dev TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can submit feedback
CREATE POLICY "Anyone can submit feedback"
ON public.feedback FOR INSERT
WITH CHECK ((user_id IS NULL) OR (user_id = auth.uid()));

-- Policy: Users can view their own feedback, admins can view all
CREATE POLICY "Users and admins can view feedback"
ON public.feedback FOR SELECT
USING (((auth.uid() IS NOT NULL) AND (auth.uid() = user_id)) OR is_admin());

-- Policy: Admins can update all feedback
CREATE POLICY "Admins can update all feedback"
ON public.feedback FOR UPDATE
USING (is_admin());

-- Policy: Admins can delete feedback
CREATE POLICY "Admins can delete feedback"
ON public.feedback FOR DELETE
USING (is_admin());

-- Users can update their own feedback
CREATE POLICY "Users can update own feedback"
ON public.feedback FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admin users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Admin policies
CREATE POLICY "Admins can view admin list"
ON public.admin_users FOR SELECT
USING (is_admin());

CREATE POLICY "Admins can add new admins"
ON public.admin_users FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Admins can remove admins"
ON public.admin_users FOR DELETE
USING (is_admin());

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  );
$$;
`);

      // ==========================================
      // README
      // ==========================================
      zip.file('README.md', `# Feedback Widget Template

A drop-in feedback collection system with AI-powered analysis.

## Quick Start

\`\`\`tsx
import { FeedbackWidget } from '@/feedback';

function App() {
  return (
    <div>
      <FeedbackWidget enableAI />
    </div>
  );
}
\`\`\`

## Installation Steps

1. **Copy the \`src/feedback/\` folder** to your project
2. **Run the database setup SQL** in your Supabase dashboard
3. **Deploy edge functions** from \`supabase/functions/\`
4. **Import and use** the FeedbackWidget component

## Features

- 🎯 Element targeting - users click to highlight issues
- 🤖 AI analysis - automatic categorization & summaries
- 📊 Admin dashboard - manage all feedback
- 🎨 Fully customizable - colors, position, features

## Requirements

- React 18+
- Supabase project (or Lovable Cloud)
- Edge functions deployed

## Configuration

\`\`\`tsx
<FeedbackWidget
  appName="MyApp"
  position="bottom-right"
  enableAI={true}
  showElementPicker={true}
  buttonColor="#3b82f6"
/>
\`\`\`

## Full Documentation

See the complete source and documentation at:
https://github.com/thecardsguy/feedback-chatbot

## License

MIT License
`);

      // Generate the zip file
      const blob = await zip.generateAsync({ type: 'blob' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'feedback-widget-template.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (error) {
      console.error('Failed to generate ZIP:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6 bg-card/80 backdrop-blur border-border">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <FileArchive className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">Download Template</h3>
          <p className="text-sm text-muted-foreground">
            Complete template with all files
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          12 files
        </Badge>
      </div>

      {/* File Preview */}
      <div className="mb-6 p-4 rounded-xl bg-muted/30 border border-border max-h-48 overflow-y-auto">
        <p className="text-sm font-medium text-foreground mb-3">Included files:</p>
        <div className="space-y-1.5">
          {FILE_STRUCTURE.map((item) => (
            <div key={item.name} className="flex items-center gap-3 text-sm">
              {item.type === 'folder' ? (
                <Folder className="w-4 h-4 text-blue-500 shrink-0" />
              ) : (
                <File className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
              <span className="font-mono text-xs text-foreground truncate">{item.name}</span>
              <span className="text-muted-foreground text-xs ml-auto shrink-0">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Download Button */}
      <Button
        onClick={generateAndDownloadZip}
        disabled={isGenerating}
        className="w-full gap-2"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating ZIP...
          </>
        ) : downloaded ? (
          <>
            <Check className="w-5 h-5" />
            Downloaded!
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            Download Template ZIP
          </>
        )}
      </Button>

      {/* Alternative: GitHub */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center mb-3">
          Or get the full source with animations
        </p>
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => window.open('https://github.com/thecardsguy/feedback-chatbot', '_blank')}
        >
          View on GitHub
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

export default DownloadTemplate;
