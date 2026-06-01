import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function exploreHttp(url, protocol = 'https') {
  let targetUrl = url;
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = `${protocol}://${targetUrl}`;
  }
  
  const startTime = Date.now();
  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: { 'User-Agent': 'E-Ucionica-HttpExplorer/1.0' }
    });
    const endTime = Date.now();
    const contentType = response.headers.get('content-type') || '';
    let data;
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    return {
      success: true,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      contentType,
      data,
      responseTime: endTime - startTime,
      protocol
    };
  } catch (err) {
    return {
      success: false,
      error: { message: err.message, code: 'FETCH_ERROR' }
    };
  }
}

function getHandshakeData(protocol = 'https') {
  if (protocol === 'http') {
    return {
      protocol: 'HTTP',
      handshake: 'HTTP nema TLS handshake – podaci se prenose u čistom tekstu.',
      steps: [],
      className: 'alert-warning',
      titleClass: 'text-warning'
    };
  }
  // za 'https' i 'json' (JSON API nema handshake, ali dajemo HTTPS informaciju radi edukacije)
  return {
    protocol: 'HTTPS (TLS 1.3)',
    handshake: 'Kriptografski rukovanje koje uspostavlja sigurnu vezu.',
    steps: [
      'Client Hello – klijent šalje podržane enkripcije',
      'Server Hello – server bira enkripciju i šalje sertifikat',
      'Verifikacija sertifikata i razmena ključeva',
      'Change Cipher Spec – prelazak na šifrovanu komunikaciju'
    ],
    className: 'alert-success',
    titleClass: 'text-success'
  };
}

export async function exploreHttpEndpoint(req, res, next) {
  try {
    const { url, protocol } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, error: { message: 'URL je obavezan' } });
    }
    if (protocol && !['http', 'https', 'json'].includes(protocol)) {
      return res.status(400).json({ success: false, error: { message: 'Protocol mora biti http, https ili json' } });
    }

    // Poseban tretman za "json" protokol – uvijek dohvaća podatke sa JSONPlaceholder API-ja
    if (protocol === 'json') {
      // Koristi exploreHttp funkciju sa unaprijed definisanim URL-om i HTTPS protokolom
      const result = await exploreHttp('jsonplaceholder.typicode.com/posts', 'https');
      if (result.success) {
        result.handshake = getHandshakeData('https');
      }
      return res.status(200).json(result);
    }

    // Za http/https normalan tok
    const result = await exploreHttp(url, protocol || 'https');
    if (result.success) {
      result.handshake = getHandshakeData(protocol || 'https');
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error('Greška u exploreHttpEndpoint:', error);
    return res.status(500).json({ success: false, error: { message: 'Interna greška servera', code: 'INTERNAL_ERROR' } });
  }
}

export async function getHandshakeEndpoint(req, res, next) {
  try {
    const { protocol } = req.query;
    const handshake = getHandshakeData(protocol || 'https');
    return res.status(200).json(handshake);
  } catch (error) {
    console.error('Greška u getHandshakeEndpoint:', error);
    return res.status(500).json({ error: 'Interna greška servera' });
  }
}

export async function getJsonExample(req, res) {
  res.json({
    id: 1,
    title: 'example JSON odgovor',
    body: 'Ovo je JSON koji vraća naš server za potrebe iframe demonstracije.',
    userId: 1,
    timestamp: new Date().toISOString()
  });
}

export async function getHtmlExample(req, res) {
  res.render('public/api-example', {});
}

export async function getImageExample(req, res) {
  const imagePath = path.join(process.cwd(), 'src', 'public', 'images', 'otvoreno-racunarstvo', 'api-example.png');
  try {
    const buffer = await sharp(imagePath)
      .resize(800, 600, { fit: 'inside' })
      .png()
      .toBuffer();
    res.setHeader('Content-Type', 'image/png');
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(404).type('text/plain').send('Slika nije pronađena');
  }
}

export async function getPdfExample(req, res) {
  const pdfPath = path.join(process.cwd(), 'src', 'public', 'pdf', 'api-example.pdf');
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename="api-example.pdf"');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.sendFile(pdfPath, (err) => {
    if (err) {
      console.error('Greška pri slanju PDF-a:', err);
      res.status(404).send('PDF dokument nije pronađen');
    }
  });
}

let sensorReadings = [];

export function receiveSensorData(req, res) {
  const { device, t, h, p, s, r, l } = req.body;
  if (t === undefined || h === undefined || p === undefined || s === undefined || r === undefined || l === undefined) {
    return res.status(400).json({ error: 'Nedostaju podaci (t, h, p, s, r, l)' });
  }
  const reading = {
    device: device || 'esp32',
    temperature: parseFloat(t),
    humidity: parseFloat(h),
    pressure: parseFloat(p),
    soil: parseInt(s),
    rain: parseInt(r),
    light: parseInt(l),
    timestamp: new Date().toISOString()
  };
  sensorReadings.unshift(reading);
  if (sensorReadings.length > 50) sensorReadings.pop();
  console.log(`[IoT] ${reading.device} | T:${reading.temperature}°C H:${reading.humidity}% P:${reading.pressure}hPa S:${reading.soil}% R:${reading.rain}% L:${reading.light}%`);
  res.status(200).json({ status: 'ok' });
}

export function getLatestReadings(req, res) {
  res.json(sensorReadings.slice(0, 20));
}