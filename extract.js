const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const startIndex = html.indexOf('const projects = [');
const endIndex = html.indexOf('];\r\n\r\nfunction phDiv'); // Use \n or \r\n
const endIndexFlex = html.indexOf('function phDiv') - 6;

const projectsStr = html.substring(startIndex, html.indexOf('];', startIndex) + 2);

fs.writeFileSync('projects.js', projectsStr);

html = html.substring(0, startIndex) + html.substring(html.indexOf('];', startIndex) + 2);

// Add the <script src="projects.js"> before <script> tag
html = html.replace('<script>\r\n\r\n// Filter state', '<script src="projects.js"></script>\r\n<script>\r\n\r\n// Filter state');
html = html.replace('<script>\n\n// Filter state', '<script src="projects.js"></script>\n<script>\n\n// Filter state');

fs.writeFileSync('index.html', html);
console.log('Extracted projects array to projects.js');
