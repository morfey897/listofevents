
import { useCallback, useEffect, useMemo } from "react";
import { IconButton, Tooltip } from "@material-ui/core";
import {
  Facebook as FacebookIcon,
} from '@material-ui/icons';
import { bindActionCreators } from "redux";
import { fetchConfigActionCreator } from "../model/actions";
import { connect } from "react-redux";
import queryString from "query-string";

function FacebookEnter({ title, onClick, disabled, settings, fetchConfig }) {

  useEffect(() => {
    if (!settings) {
      fetchConfig();
    }
  }, [settings]);

  const state = useMemo(() => {
    return `facebook_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const fbLink = useMemo(() => {
    if (!settings || !settings.appId) return;

    const stringifiedParams = queryString.stringify({
      client_id: settings.appId,
      redirect_uri: process.env.FACEBOOK_ENTER,
      state,
      scope: ["public_profile", "email"].concat(settings.state === "production" ? "user_link" : "").filter(a => !!a).join(","),
      response_type: 'code',
      auth_type: 'rerequest',
      display: 'popup',
    });

    return `https://www.facebook.com/v9.0/dialog/oauth?${stringifiedParams}`;
  }, [settings]);

  const onPress = useCallback(() => {
    if (!disabled && fbLink) {
      window.open(fbLink, "_blank");
      onClick(state);
    }
  }, [fbLink, settings, disabled]);

  return <Tooltip title={title}>
    <IconButton onClick={onPress}>
      <FacebookIcon style={{ color: "#485993" }} />
    </IconButton>
  </Tooltip>;
}

const mapStateToProps = (state) => {
  const { config } = state;

  return {
    settings: config.apps["facebook"],
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchConfig: fetchConfigActionCreator
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FacebookEnter);