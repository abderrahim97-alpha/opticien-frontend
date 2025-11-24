import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../Api/axios';
import {
  Monture,
  MarketplaceFilters,
  MarketplaceResponse,
  FilterOptions,
  MarketplaceStats,
} from '../types/marketplace';

const DEFAULT_FILTERS: MarketplaceFilters = {
  search: '',
  brand: '',
  type: '',
  genre: '',
  forme: '',
  couleur: '',
  materiau: '',
  minPrice: null,
  maxPrice: null,
  sortBy: 'createdAt',
  sortOrder: 'DESC',
};

const ITEMS_PER_PAGE = 12;

export const useMarketplace = () => {
  const [montures, setMontures] = useState<Monture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MarketplaceFilters>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: ITEMS_PER_PAGE,
    totalPages: 0,
  });
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [stats, setStats] = useState<MarketplaceStats | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchRef = useRef<string>(''); // 🔥 Track last fetch to prevent duplicates

  // ✅ Get auth headers
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');
    return { Authorization: `Bearer ${token}` };
  }, []);

  // ✅ Fetch filter options ONCE on mount
  useEffect(() => {
    let mounted = true;
    const fetchFilterOptions = async () => {
      try {
        const headers = getAuthHeaders();
        const response = await api.get('/marketplace/filters/options', { headers });
        if (mounted) setFilterOptions(response.data);
      } catch (err: any) {
        console.error('❌ Error fetching filter options:', err.response?.data || err.message);
      }
    };
    fetchFilterOptions();
    return () => { mounted = false; };
  }, []); // ✅ Empty deps - run once

  // ✅ Fetch stats ONCE on mount
  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      try {
        const headers = getAuthHeaders();
        const response = await api.get('/marketplace/stats', { headers });
        if (mounted) setStats(response.data);
      } catch (err: any) {
        console.error('❌ Error fetching stats:', err.response?.data || err.message);
      }
    };
    fetchStats();
    return () => { mounted = false; };
  }, []); // ✅ Empty deps - run once

  // ✅ Main fetch function - NO dependencies except getAuthHeaders
  const fetchMonturesInternal = useCallback(
    async (filtersToUse: MarketplaceFilters, page: number) => {
      // 🔥 Create unique key for this fetch
      const fetchKey = JSON.stringify({ ...filtersToUse, page });
      
      // 🔥 Prevent duplicate fetches
      if (lastFetchRef.current === fetchKey) {
        console.log('⏭️ Skipping duplicate fetch');
        return;
      }
      
      lastFetchRef.current = fetchKey;

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setLoading(true);
      setError(null);
      
      try {
        const headers = getAuthHeaders();
        const params: Record<string, any> = {
          page,
          limit: ITEMS_PER_PAGE,
          sortBy: filtersToUse.sortBy,
          sortOrder: filtersToUse.sortOrder,
        };

        Object.entries(filtersToUse).forEach(([key, value]) => {
          if (value !== '' && value !== null && key !== 'sortBy' && key !== 'sortOrder') {
            params[key] = value;
          }
        });

        console.log('🔍 Fetching montures:', { page, filters: filtersToUse });

        const response = await api.get<MarketplaceResponse>('/marketplace/montures', {
          headers,
          params,
          signal: abortControllerRef.current.signal,
        });

        setMontures(response.data.data);
        setPagination(response.data.pagination);
        setCurrentPage(page);
        console.log('✅ Fetched:', response.data.data.length, 'montures');
      } catch (err: any) {
        if (err.name === 'AbortError' || err.name === 'CanceledError') {
          console.log('🚫 Request cancelled');
          return;
        }
        const message =
          err.response?.data?.error ||
          err.response?.data?.message ||
          'Erreur lors du chargement des montures';
        setError(message);
        console.error('❌ Fetch error:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeaders]
  );

  // ✅ Debounced fetch - triggered ONLY when filters change
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce: 800ms for search, 300ms for others
    const hasSearchChanged = filters.search !== DEFAULT_FILTERS.search;
    const delay = hasSearchChanged ? 800 : 300;
    
    console.log('⏰ Debouncing fetch...', delay, 'ms');
    
    debounceTimerRef.current = setTimeout(() => {
      console.log('🔄 Filters changed, fetching page 1...');
      fetchMonturesInternal(filters, 1);
    }, delay);

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [filters, fetchMonturesInternal]);

  // ✅ Update filter - memoized
  const updateFilter = useCallback((key: keyof MarketplaceFilters, value: any) => {
    console.log(`📝 Filter updated: ${key} =`, value);
    setFilters((prev) => {
      // 🔥 Only update if value actually changed
      if (prev[key] === value) {
        console.log('⏭️ Filter unchanged, skipping update');
        return prev;
      }
      return { ...prev, [key]: value };
    });
  }, []);

  // ✅ Reset filters
  const resetFilters = useCallback(() => {
    console.log('🔄 Resetting filters');
    setFilters(DEFAULT_FILTERS);
    lastFetchRef.current = ''; // Reset fetch tracking
  }, []);

  // ✅ Go to page
  const goToPage = useCallback(
    (page: number) => {
      if (page === currentPage) {
        console.log('⏭️ Already on page', page);
        return;
      }
      console.log('📄 Going to page:', page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      fetchMonturesInternal(filters, page);
    },
    [currentPage, fetchMonturesInternal, filters]
  );

  // ✅ Manual refetch
  const refetch = useCallback(() => {
    console.log('🔄 Manual refetch');
    lastFetchRef.current = ''; // Allow refetch
    fetchMonturesInternal(filters, currentPage);
  }, [fetchMonturesInternal, filters, currentPage]);

  return {
    montures,
    loading,
    error,
    filters,
    updateFilter,
    resetFilters,
    pagination,
    goToPage,
    filterOptions,
    stats,
    refetch,
  };
};