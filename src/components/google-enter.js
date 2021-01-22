
import { useEffect, useMemo, useCallback } from "react";
import { CircularProgress } from '@material-ui/core';
import { useTheme } from "@material-ui/core/styles";
import { bindActionCreators } from "redux";
import { fetchConfigActionCreator } from "../model/actions";
import { connect } from "react-redux";
import { GoogleLogin } from "react-google-login";

function GoogleEnter({ title, onClick, disabled, settings, fetchConfig }) {

  const theme = useTheme();

  useEffect(() => {
    if (!settings) {
      fetchConfig();
    }
  }, [settings]);

  const googleAppId = useMemo(() => {
    return settings && settings.appId || "";
  }, [settings]);

  const state = useMemo(() => {
    return `facebook_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const onSuccess = useCallback((response) => {
    onClick({ type: "google", state, token: response.tokenId });
  }, []);

  const onFail = useCallback(() => {
    onClick({});
  }, []);

  return googleAppId ? <GoogleLogin
    clientId={googleAppId}
    buttonText={title}
    onSuccess={onSuccess}
    onFailure={onFail}
    disabledProp={disabled}
    theme={theme.palette.type}
    cookiePolicy={process.env.HOST}
  /> : <CircularProgress />;
}

const mapStateToProps = (state) => {
  const { config } = state;
  return {
    settings: config.apps["google"],
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchConfig: fetchConfigActionCreator
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GoogleEnter);