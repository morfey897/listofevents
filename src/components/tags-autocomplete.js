import { useCallback, useState } from "react";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { CircularProgress, TextField } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { transliterate } from "inflected";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchTagsActionCreator } from "../model/actions";
import { STATUSES } from "../enums";

const filter = createFilterOptions();

function TagsAutocomplete({ values, options, isLoading, limit = 3, onChange, fetchTags }) {

  const { t } = useTranslation("tags_block");

  const [isLoaded, setLoaded] = useState(false);

  const onChangeValue = useCallback((event, newValue) => {
    if (typeof onChange === "function") {
      onChange(newValue.map((item) => (item.inputValue ? item.inputValue : item)));
    }
  }, [onChange]);

  const onOpen = useCallback(() => {
    if (isLoading) {
      setLoaded(true);
    } else if (!isLoaded) {
      setLoaded(true);
      fetchTags();
    }
  }, [isLoading, isLoaded]);

  return <Autocomplete
    value={values}
    multiple
    fullWidth
    freeSolo
    filterSelectedOptions
    autoHighlight
    limitTags={limit}
    options={options}
    getOptionLabel={(option) => {
      return typeof option === 'string' ? option : option.title || t(option.token);
    }}
    getOptionDisabled={(option) => typeof option === 'string' ? false : option.disabled}
    filterOptions={(options, params) => {
      const filtered = filter(options, params);

      // Suggest the creation of a new value
      if (params.inputValue) {
        let label = transliterate("#" + params.inputValue.trim().replace(/#/g, "")).replace(/\s+/g, "_").toLowerCase();
        filtered.push({
          disabled: label.length < 4,
          inputValue: label,
          title: t("add", { tag: label })
        });
      }

      return filtered;
    }}

    onChange={onChangeValue}
    onOpen={onOpen}

    renderInput={(params) => (
      <TextField {...params} variant="outlined" label={t("label")} margin="dense"
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
  const { tags } = state;
  const isLoading = tags.status === STATUSES.STATUS_PENDING;

  return {
    options: isLoading ? [{ disabled: true, token: "loading" }] : (tags.list.length ? tags.list : [{ disabled: true, token: "no_options_text" }]),
    isLoading,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchTags: fetchTagsActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TagsAutocomplete);