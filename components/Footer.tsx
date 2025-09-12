export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container grid grid-cols-12 gap-4 py-10" data-aos="fade-up">
        <div className="col-span-12 md:col-span-4">
          <div className="font-extrabold mb-1">✈️ awesometraveltours</div>
          <p className="muted">Tours & custom trips in Singapore.</p>
        </div>
        <div className="col-span-6 md:col-span-4">
          <h4 className="font-bold mb-2">Contact</h4>
          <ul className="space-y-1">
            <li>WhatsApp: +65 8000 0000</li>
            <li>Email: hello@awesometraveltours.sg</li>
            <li>Hours: 9:00–19:00 (GMT+8)</li>
          </ul>
        </div>
        <div className="col-span-6 md:col-span-4">
          <h4 className="font-bold mb-2">Location</h4>
          <ul className="space-y-1">
            <li>Singapore</li>
            <li>Pickup at your hotel or meeting point</li>
          </ul>
        </div>
      </div>
      <p className="text-center text-sm text-gray-500 pb-6">© {new Date().getFullYear()} awesometraveltours. All rights reserved.</p>
    </footer>
  );
}
