
import React, { useCallback, useState, useEffect } from "react";
import { IconButton, Tooltip } from "@material-ui/core";
import {
  Facebook as FacebookIcon,
} from '@material-ui/icons';
import { bindActionCreators } from "redux";
import { fetchConfigActionCreator } from "../model/actions";
import { connect } from "react-redux";

function FacebookEnter({ title, settings, fetchConfig, onChange, disabled }) {

  const [sdkLoaded, setSdkLoaded] = useState(document.getElementById('facebook-jssdk') != undefined);
  const [meData, setMe] = useState({ status: "none", me: {} });

  useEffect(() => {
    if (typeof onChange === "function") {
      onChange({ ...meData });
    }
  }, [onChange, meData]);

  useEffect(() => {
    if (meData._st == 1 && sdkLoaded && settings) {
      setMe(data => ({ ...data, _st: 2 }));
      window.FB.init({
        appId: settings.appId,
        cookie: true,
        xfbml: true,
        version: 'v9.0'
      });
      window.FB.getLoginStatus(function (stRes) {
        if (stRes.status == "connected") {
          window.FB.api('/me', { "fields": ["id", "name", "email"].concat(settings.state === "production" ? "user_link" : "").filter(a => !!a).join(",") }, function (apiRes) {
            setMe(data => ({
              ...data,
              _st: 3,
              status: "logged",
              me: {
                id: apiRes.id,
                name: apiRes.name,
                email: apiRes.email,
                link: apiRes.user_link || `https://www.facebook.com/`,
                access_token: stRes.authResponse.accessToken
              }
            }));
          });
        } else {
          window.FB.login((loginRes) => {
            // console.log("login", loginResponse);
          }, { scope: ["public_profile", "email"].concat(settings.state === "production" ? "user_link" : "").filter(a => !!a).join(","), auth_type: 'rerequest' });
        }
      });
    }
  }, [meData, settings, sdkLoaded]);

  const loadSDK = useCallback(() => {
    window.fbAsyncInit = () => {
      setSdkLoaded(true);
    };
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }, []);

  const onClick = useCallback(() => {
    loadSDK();
    if (!settings) {
      fetchConfig();
    }
    setMe(data => ({ ...data, status: "loading", _st: 1 }));
  }, [settings]);

  return <Tooltip title={title}>
    <IconButton onClick={onClick} disabled={disabled}>
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