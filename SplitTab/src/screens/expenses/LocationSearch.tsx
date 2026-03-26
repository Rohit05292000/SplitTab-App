import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { searchLocation, cancelSearch } from '../../api/locationApi';
import { LocationSearchResult } from '../../types';

import { InputField } from '../../components/common/InputField';
import { Card } from '../../components/common/Card';
import { SelectableOption } from '../../components/common/SelectableOption';
import { SpinnerCard } from '../../components/common/SpinnerCard';
import { EmptyState } from '../../components/common/EmptyState';

interface LocationSearchProps {
  onLocationSelect: (
    location:
      | { displayName: string; lat: number; lon: number }
      | undefined
  ) => void;
}

export const LocationSearch = ({
  onLocationSelect,
}: LocationSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestQueryRef = useRef('');
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      cancelSearch();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    latestQueryRef.current = value;

    // ✅ reset selection when user types again
    if (selectedLocation) {
      setSelectedLocation(null);
      onLocationSelect(undefined);
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      cancelSearch();
      setResults([]);
      setIsSearching(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      setIsSearching(true);

      searchLocation(value, (searchResults) => {
        if (
          !isMountedRef.current ||
          latestQueryRef.current !== value
        ) return;

        setResults(searchResults || []);
        setIsSearching(false);
      });
    }, 400);
  };

  const handleSelect = (result: LocationSearchResult) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);

    if (isNaN(lat) || isNaN(lon)) return;

    setSelectedLocation(result.displayName);
    setQuery(result.displayName);
    setResults([]);

    onLocationSelect({
      displayName: result.displayName,
      lat,
      lon,
    });
  };

  const handleClear = () => {
    setQuery('');
    setSelectedLocation(null);
    setResults([]);
    cancelSearch();
    onLocationSelect(undefined);
  };

  // ✅ FIXED CONDITION
  const shouldShowDropdown =
    !selectedLocation &&
    (isSearching ||
      results.length > 0 ||
      (query.length > 2 && results.length === 0));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        {/* INPUT */}
        <InputField
          value={query}
          onChangeText={handleSearch}
          placeholder="Search for a location..."
          rightElement={
            selectedLocation ? (
              <TouchableOpacity onPress={handleClear}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            ) : null
          }
        />

        {/* DROPDOWN */}
        {shouldShowDropdown && (
          <Card style={styles.dropdownCard}>
            {isSearching ? (
              <SpinnerCard text="Searching..." />
            ) : results.length > 0 ? (
              <FlatList
                data={results}
                keyExtractor={(item) => String(item.placeId)}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}

                // ✅ FIX: prevents VirtualizedList error
                scrollEnabled={false}

                // optional safety
                removeClippedSubviews={false}

                style={{ maxHeight: 200 }}
                renderItem={({ item }) => (
                  <SelectableOption
                    label={item.displayName}
                    selected={false}
                    onPress={() => handleSelect(item)}
                  />
                )}
              />
            ) : (
              <EmptyState title="No results found" />
            )}
          </Card>
        )}

        {/* SELECTED */}
        {selectedLocation && (
          <Text style={styles.selectedText}>
            ✓ Location selected: {selectedLocation}
          </Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 6,
  },
  clearText: {
    color: '#4b5563',
    paddingHorizontal: 8,
  },
  dropdownCard: {
    marginTop: 6,
    padding: 0,
  },
  selectedText: {
    fontSize: 11,
    color: '#16a34a',
    marginTop: 6,
  },
});