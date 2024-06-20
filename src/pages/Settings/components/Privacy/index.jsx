import React from "react";
import { Switch } from "@mantine/core";
import "./style.scss";
const Privacy = () => {
  return (
    <section className="privacy">
      <div className="heading_text">
        <h1>Privacy</h1>
      </div>
      <div className="privacy_content pt-5">
        <Switch
          defaultChecked
          labelPosition="left"
          label="Show my subscriptions count"
          size="lg"
        />

        <Switch
          defaultChecked
          labelPosition="left"
          label="Who can message me?"
          size="lg"
        />

        <Switch
          defaultChecked
          labelPosition="left"
          label="Who can watch my videos?"
          size="lg"
        />
      </div>
    </section>
  );
};

export default Privacy;
