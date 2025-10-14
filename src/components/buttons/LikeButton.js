import React from "react";

import { Theme } from "../../theme";
import { CircleIconButton } from "./CircleIconButton";

export const LikeButton = ({ isLiked, style, onClick }) => {
  return (
    <CircleIconButton
      iconName={isLiked ? "md-heart" : "md-heart-outline"}
      iconColor={isLiked ? "#FE346E" : Theme.colors.gray}
      style={style}
      onPress={onClick}
    />
  );
};
