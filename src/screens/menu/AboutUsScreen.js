import React, { useState } from "react";
import { Dimensions, ScrollView } from "react-native";

import { HtmlView } from "../../components";

const WIDTH = Dimensions.get("screen").width;

const AboutUsScreen = () => {
  const [state, setState] = useState({
    aboutUs: "<div style='text-align:center !important;'><h2>Elmer Diaz</h2><img src='https://media-exp1.licdn.com/dms/image/C4E03AQGiwS4itPVmrA/profile-displayphoto-shrink_800_800/0/1641257148364?e=1660780800&v=beta&t=F4ITNel5G8ABkHqNCA66rhOzyE3XI0fr0S6gOTPmiJY' style='margin:10px auto !important; display:block; border-radius: 50%'/><p>(804) 555-1234<br /><a href='mailto:elmer@thediazteam.com'>elmer@thediazteam.com</a></div>",
    website: null,
  });

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <HtmlView htmlContent={state.aboutUs} imagesMaxWidthOffset={WIDTH - 200} />
    </ScrollView>
  );
};

export default AboutUsScreen;
