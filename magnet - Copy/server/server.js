const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname))
});
const upload = multer({ storage });

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));
app.use('/uploads', express.static(uploadDir));

const dataFile = path.join(__dirname, 'orders.json');
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, '[]', 'utf-8');

function getOrders() {
  return JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
}

function saveOrders(orders) {
  fs.writeFileSync(dataFile, JSON.stringify(orders, null, 2), 'utf-8');
}

app.post('/api/upload', upload.single('image'), (req, res) => {
  const orders = getOrders();
  orders.push({
    id: Date.now().toString(),
    email: req.body.email,
    image: '/uploads/' + req.file.filename,
    completed: false
  });
  saveOrders(orders);
  res.json({ success: true });
});

app.get('/api/orders', (req, res) => res.json(getOrders()));

app.post('/api/orders/:id/complete', (req, res) => {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === req.params.id);
  if (idx >= 0) {
    orders[idx].completed = true;
    saveOrders(orders);
  }
  res.json({ success: true });
});

app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));

