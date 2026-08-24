import { CaseStudy, CaseStudyInput } from '@/types/database';
import { supabase, isSupabaseConfigured } from './client';
import { INITIAL_CASE_STUDIES } from '../sample-data';

const STORAGE_KEY = 'studioflag_case_studies_store_v2';

function getLocalStore(): CaseStudy[] {
  if (typeof window === 'undefined') {
    return INITIAL_CASE_STUDIES;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CASE_STUDIES));
      return INITIAL_CASE_STUDIES;
    }
    const parsed: CaseStudy[] = JSON.parse(raw);
    // Ensure hero_image is always attached if missing in older cached data
    const merged = parsed.map((item) => {
      const match = INITIAL_CASE_STUDIES.find((init) => init.slug === item.slug || init.id === item.id);
      return {
        ...item,
        hero_image: item.hero_image || match?.hero_image || INITIAL_CASE_STUDIES[0].hero_image,
        accent_color: item.accent_color || match?.accent_color || '#C6A15B',
      };
    });
    return merged;
  } catch (e) {
    return INITIAL_CASE_STUDIES;
  }
}

function setLocalStore(data: CaseStudy[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new Event('studioflag_storage_update'));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }
}

export async function getCaseStudies(includeDrafts = false): Promise<CaseStudy[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase
      .from('case_studies')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!includeDrafts) {
      query = query.eq('status', 'published');
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data as CaseStudy[];
    }
  }

  // Fallback to local store
  const localData = getLocalStore();
  const filtered = includeDrafts 
    ? localData 
    : localData.filter((item) => item.status === 'published');
  return filtered.sort((a, b) => a.sort_order - b.sort_order);
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('slug', slug)
      .single();

    if (!error && data) {
      return data as CaseStudy;
    }
  }

  const localData = getLocalStore();
  return localData.find((item) => item.slug === slug) || null;
}

export async function getAdjacentCaseStudies(currentSortOrder: number): Promise<{ prev: CaseStudy | null; next: CaseStudy | null }> {
  const all = await getCaseStudies(false);
  const currentIndex = all.findIndex((item) => item.sort_order === currentSortOrder);
  
  if (currentIndex === -1) {
    return { prev: null, next: all[0] || null };
  }

  const prev = currentIndex > 0 ? all[currentIndex - 1] : all[all.length - 1];
  const next = currentIndex < all.length - 1 ? all[currentIndex + 1] : all[0];

  return { prev, next };
}

export async function createCaseStudy(input: CaseStudyInput): Promise<CaseStudy> {
  const newStudy: CaseStudy = {
    ...input,
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cs-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('case_studies')
      .insert([newStudy])
      .select()
      .single();

    if (!error && data) {
      return data as CaseStudy;
    }
  }

  const list = getLocalStore();
  const updated = [newStudy, ...list];
  setLocalStore(updated);
  return newStudy;
}

export async function updateCaseStudy(id: string, input: Partial<CaseStudyInput>): Promise<CaseStudy> {
  const updatePayload = {
    ...input,
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('case_studies')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      return data as CaseStudy;
    }
  }

  const list = getLocalStore();
  const updated = list.map((item) => (item.id === id ? { ...item, ...updatePayload } : item));
  setLocalStore(updated);
  return updated.find((item) => item.id === id)!;
}

export async function deleteCaseStudy(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('case_studies')
      .delete()
      .eq('id', id);

    if (!error) return true;
  }

  const list = getLocalStore();
  const updated = list.filter((item) => item.id !== id);
  setLocalStore(updated);
  return true;
}

export async function reorderCaseStudies(reorderedList: CaseStudy[]): Promise<boolean> {
  const withNewOrders = reorderedList.map((item, index) => ({
    ...item,
    sort_order: index + 1,
    updated_at: new Date().toISOString(),
  }));

  if (isSupabaseConfigured && supabase) {
    // Perform updates
    for (const item of withNewOrders) {
      await supabase
        .from('case_studies')
        .update({ sort_order: item.sort_order })
        .eq('id', item.id);
    }
    return true;
  }

  setLocalStore(withNewOrders);
  return true;
}

export async function resetToSampleData(): Promise<void> {
  setLocalStore(INITIAL_CASE_STUDIES);
}

export async function clearAllData(): Promise<void> {
  setLocalStore([]);
}
