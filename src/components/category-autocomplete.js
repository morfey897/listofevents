import { useCallback, useState } from "react";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { CircularProgress, TextField } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchCategoriesActionCreator } from "../model/actions";
import { STATUSES } from "../enums";

const filter = createFilterOptions();

function CategoryAutocomplete({ value, options, isLoading, isModerator, onChange, error, fetchCategories }) {

  const { t } = useTranslation("categories_block");

  const [isLoaded, setLoaded] = useState(false);

  const onChangeValue = useCallback((event, newValue) => {
    if (typeof onChange === "function") {
      if (typeof newValue === "string") {
        onChange({ name: newValue, _id: 0 });
      } else if (newValue && newValue.inputValue) {
        onChange({ name: newValue.inputValue, _id: 0 });
      } else {
        onChange(newValue);
      }
    }
  }, [onChange]);

  const onOpen = useCallback(() => {
    if (isLoading) {
      setLoaded(true);
    } else if (!isLoaded) {
      setLoaded(true);
      fetchCategories({ limit: 100 });
    }
  }, [isLoading, isLoaded]);

  return <Autocomplete
    value={value}
    fullWidth
    freeSolo
    clearOnBlur
    selectOnFocus
    handleHomeEndKeys
    options={options}
    getOptionLabel={(option) => {
      return typeof option === 'string' ? option : option.name || t(option.token);
    }}
    onChange={onChangeValue}
    onOpen={onOpen}
    getOptionDisabled={(option) => typeof option === 'string' ? false : option.disabled}
    filterOptions={(options, params) => {
      const filtered = filter(options, params);

      if (isModerator && params.inputValue && params.inputValue.trim().length) {
        let label = params.inputValue.trim();
        filtered.push({
          inputValue: label,
          name: t("add", { category: label }),
          _id: 0
        });
      }

      return filtered;
    }}
    renderInput={(params) => (
      <TextField {...params} error={error} required variant="outlined" label={t("label")} margin="dense"
        InputProps={{
          ...params.InputProps,
          endAdornment: <>
            {isLoading && <CircularProgress color="inherit" size={20} />}
            {params.InputProps.endAdornment}
          </>
        }} />
    )}
  />;
}

const mapStateToProps = (state) => {
  const { categories, user, config } = state;
  const isLoading = categories.status === STATUSES.STATUS_PENDING;
  return {
    options: isLoading ? [{ disabled: true, token: "loading" }] : (categories.list.length ? categories.list : [{ disabled: true, token: "no_options_text" }]),
    isLoading,
    isLogged: user.isLogged,
    isModerator: user.isLogged && (user.user.role & config.roles.moderator) === config.roles.moderator,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchCategories: fetchCategoriesActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CategoryAutocomplete);