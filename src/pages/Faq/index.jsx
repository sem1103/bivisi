import React, { useEffect, useState } from "react";
import { Accordion } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import axios from "axios";
import "./style.scss";
import { BASE_URL } from "../../api/baseUrl";

const Faq = () => {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/core/faq/`);
        console.log(response.data.results);  

        setFaqs(response.data.results);
      } catch (error) {
        console.error("FAQ data could not be loaded:", error);
      }
    };
    fetchFaqs();
  }, []);

  const items = faqs.map((item) => (
    <Accordion.Item key={item.id} value={item.faq}>
      <Accordion.Control>{item.faq}</Accordion.Control>
      <Accordion.Panel>{item.answer}</Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <>
      <section className="faq_section container-fluid">
        <h1>FAQs</h1>
        <Accordion chevron={<IconPlus className="chevron"/>}>
          {items}
        </Accordion>
      </section>
    </>
  );
};

export default Faq;
