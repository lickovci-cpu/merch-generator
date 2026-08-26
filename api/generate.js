export default async function handler(req, res) {
  const { product, style } = req.query;
  
  if (!product || !style) {
    return res.status(400).json({ error: "Need product and style params" });
  }

  const prompt = `Professional ${product} merchandise design: ${style}. 
    High quality, ready for print on clothing. Modern design.`;

  try {
    const response = await fetch("https://api.craiyon.com/v3/text_to_image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    
    if (!data.images || data.images.length === 0) {
      return res.status(500).json({ error: "No image generated" });
    }

    res.status(200).json({ 
      image: data.images[0],
      product,
      style,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
