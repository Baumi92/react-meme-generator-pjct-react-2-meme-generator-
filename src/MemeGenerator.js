import './MemeGenerator.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

function MemeGenerator() {
  // State variables for the text inputs and selected template
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(
    'One-Does-Not-Simply',
  );

  // State variable for the list of available templates
  const [templates, setTemplates] = useState([]);

  // Fetch the list of available templates on component mount
  useEffect(() => {
    axios
      .get('https://api.memegen.link/templates/')
      .then((response) => setTemplates(response.data))
      .catch((error) => console.log(error));
  }, []);

  // Handle the form submit to generate the meme
  function handleSubmit(event) {
    event.preventDefault();

    axios({
      method: 'GET',
      url: `https://api.memegen.link/images/${selectedTemplate}/${topText}/${bottomText}.jpg`,
      responseType: 'blob',
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${topText}_${bottomText}.jpg`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="topText">Top text</label>
        <input
          id="topText"
          value={topText}
          onChange={(e) => setTopText(e.target.value)}
        />
        <label htmlFor="bottomText">Bottom text</label>
        <input
          id="bottomText"
          value={bottomText}
          onChange={(e) => setBottomText(e.target.value)}
        />
        <label htmlFor="template">Meme template</label>
        <select
          id="template"
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
        >
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
        <button>Download Meme</button>
      </form>
      <div className="meme">
        <img
          src={`https://api.memegen.link/images/${selectedTemplate}/${topText}/${bottomText}.jpg`}
          alt="meme"
          data-test-id="meme-image"
        />
      </div>
    </div>
  );
}

export default MemeGenerator;
