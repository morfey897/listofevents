
import { useCallback, useEffect, useMemo } from "react";
import { IconButton, Tooltip } from "@material-ui/core";
import {
  Instagram as InstagramIcon,
} from '@material-ui/icons';
import { bindActionCreators } from "redux";
import { fetchConfigActionCreator } from "../model/actions";
import { connect } from "react-redux";
import queryString from "query-string";

function InstagramEnter({ title, onClick, disabled, settings, fetchConfig }) {

  useEffect(() => {
    if (!settings) {
      fetchConfig();
    }
  }, [settings]);

  const state = useMemo(() => {
    return `instagram_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const instaLink = useMemo(() => {
    if (!settings || !settings.appId) return;

    const stringifiedParams = queryString.stringify({
      client_id: settings.appId,
      redirect_uri: process.env.INSTAGRAM_ENTER,
      state,
      scope: ["user_profile"].filter(a => !!a).join(","),
      response_type: 'code',
      // auth_type: 'rerequest',
      // display: 'popup',
    });
    return `https://api.instagram.com/oauth/authorize?${stringifiedParams}`;
  }, [settings]);

  const onPress = useCallback(() => {
    if (!disabled && instaLink) {
      window.open(instaLink, "_blank");
      onClick({ state, type: "instagram" });
    }
  }, [instaLink, settings, disabled]);

  return <Tooltip title={title}>
    <IconButton onClick={onPress}>
      <InstagramIcon style={{ color: "#FF8948" }} />
    </IconButton>
  </Tooltip>;
}

const mapStateToProps = (state) => {
  const { config } = state;

  return {
    settings: config.apps["instagram"],
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchConfig: fetchConfigActionCreator
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InstagramEnter);