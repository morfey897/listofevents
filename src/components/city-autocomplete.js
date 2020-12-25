import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { TextField, Typography, Grid, makeStyles, debounce } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import {
  LocationCity as LocationCityIcon,
  LocationOn as LocationOnIcon
} from '@material-ui/icons';
import { Loader } from '@googlemaps/js-api-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { STATUSES } from '../enums';
import parse from 'autosuggest-highlight/parse';
import { useTranslation } from 'react-i18next';
import { fetchCitiesActionCreator } from '../model/actions';

const autocompleteService = { current: null };

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}));

function CityAutocomplete({ options, value, onChange, isLoading, fetchCities, error }) {
  const classes = useStyles();

  const { t, i18n } = useTranslation("cities_block");

  const [isLoaded, setLoaded] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [variables, setVariables] = useState([]);
  const [googleMapStatus, setGoogleMapStatus] = useState(STATUSES.STATUS_NONE);

  const fetch = useMemo(() => debounce((request, callback) => {
    autocompleteService.current.getPlacePredictions(request, callback);
  }, 200), []);

  useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setVariables(value ? [value] : []);
      return undefined;
    } else if (!window.google && googleMapStatus != STATUSES.STATUS_PENDING) {
      setGoogleMapStatus(STATUSES.STATUS_PENDING);
      const loader = new Loader({
        apiKey: process.env.GOOGLE_API_KEY,
        version: "weekly",
        libraries: ["places"],
        language: i18n.language
      });
      loader.load().finally(() => setGoogleMapStatus(STATUSES.STATUS_SUCCESS));
    }

    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    fetch({ input: inputValue, types: ["(cities)"], language: i18n.language }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results.map((item) => {
            return {
              place_id: item.place_id,
              name: item.structured_formatting.main_text,
              description: item.structured_formatting.secondary_text,

              parts: parse(
                item.structured_formatting.main_text,
                item.structured_formatting.main_text_matched_substrings.map((match) => [match.offset, match.offset + match.length]),
              )
            };
          })];
        }

        setVariables(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch, i18n.language, googleMapStatus]);

  const onOpen = useCallback(() => {
    if (isLoading) {
      setLoaded(true);
    } else if (!isLoaded) {
      setLoaded(true);
      fetchCities();
    }
  }, [isLoading, isLoaded]);

  return (
    <Autocomplete
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
      filterOptions={(x) => x}
      options={variables.length > 0 ? variables : options}
      autoComplete
      fullWidth
      includeInputInList
      filterSelectedOptions
      value={value}
      noOptionsText={t("no_options_text")}
      onChange={(event, newValue) => {
        setVariables(newValue ? [newValue, ...variables] : variables);
        onChange(newValue);
      }}
      onOpen={onOpen}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} error={error} required label={t("label")} variant="outlined" margin="dense" />
      )}
      renderOption={({ name, description, parts }) => {
        return (
          <Grid container alignItems="center">
            <Grid item>
              {parts && parts.length > 0 ? <LocationOnIcon className={classes.icon} /> : <LocationCityIcon className={classes.icon} />}
            </Grid>
            <Grid item xs>
              {parts && parts.length > 0 ? parts.map((part, index) => (
                <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                  {part.text}
                </span>
              )) : <Typography variant="body1" color="textPrimary">{name}</Typography>}
              <Typography variant="body2" color="textSecondary">
                {description}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
}


const mapStateToProps = (state) => {
  const { cities } = state;

  return {
    options: cities.list,
    isLoading: cities.status === STATUSES.STATUS_PENDING,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchCities: fetchCitiesActionCreator
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CityAutocomplete);