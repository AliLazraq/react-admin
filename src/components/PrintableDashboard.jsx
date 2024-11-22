import React, { forwardRef } from "react";

const PrintableDashboard = forwardRef((props, ref) => {
  return <div ref={ref}>{props.children}</div>;
});

export default PrintableDashboard;
