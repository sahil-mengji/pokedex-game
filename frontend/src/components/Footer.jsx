import React from "react";

import logo from "../assets/e-cell_logo.png";


import { Link } from "react-router-dom";
import { MarqueScroll } from "./Marque";
import ecellLogo from "../assets/e-cell_logo.png";
import { social } from "../constants/social";

export default function Footer() {
	const socialLinks = [
		{ name: 'insta', url: 'https://instagram.com/ecell_nitk' },
		{ name: 'linkedin', url: 'https://linkedin.com/company/ecell-nitk' },
		{ name: 'youtube', url: 'https://youtube.com/@ecellnitk' },
		{ name: 'whatsapp', url: 'https://wa.me/919574212640' },
		{ name: 'twitter', url: 'https://twitter.com/ecell_nitk' },
	];

	const quickLinks = [
		{ name: 'Home', path: '/' },
		{ name: 'Events', path: '/events' },
		{ name: 'Brochure', path: '/brochure' },
		{ name: 'Accommodation', path: '/accommodation' },
		{ name: 'About Us', path: '/about' },
		{ name: 'Contact', path: '/contact' },
		{ name: 'Team', path: '/team' },
	];


	return (
		<>
			{/* <MarqueScroll
				border="border-white"
				texts={["Entrepreneurship", "Startups", "Networking"]}
				colors={["white", "white", "white"]}
				angle={2}
				className="bg-black mt-5"
			/>
			<MarqueScroll
				border="border-white"
				texts={["Entrepreneurship", "Startups", "Networking"]}
				colors={["white", "white", "white"]}
				angle={-2}
				className="bg-black mt-[-3.5em]"
			/> */}

			<footer className="bg-gradient-to-r  from-[#001b339a] to-[#4608009a] text-white py-12 ">
				<div className="container w-full mx-auto flex flex-col md:flex-row gap-8 md:gap-20 lg:gap-32 justify-center items-center ">
					<div className="mb-8 md:mb-0">
						<div className="flex  mb-4">
							<img
								src={logo}
								alt="E-Cell Logo"
								width={50}
								height={50}
								className="mr-2"
							/>
							<div>
								<h2 className="text-2xl font-bold">E-Cell</h2>
								<p className="text-sm text-blue-300">NITK Surathkal</p>
							</div>
						</div>
						<p className="mb-4 text-lg font-semibold">Follow Us on</p>
						<div className="flex space-x-4">

							<a href="https://instagram.com/ecell_nitk" className="bg-gray-700 p-2 rounded-full">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="w-5 h-5"
								>
									<rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
									<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
									<line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
								</svg>
							</a>
							<a href="https://linkedin.com/company/ecell-nitk" className="bg-gray-700 p-2 rounded-full">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="w-5 h-5"
								>
									<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
									<rect x="2" y="9" width="4" height="12" />
									<circle cx="4" cy="4" r="2" />
								</svg>
							</a>
							<a href="https://x.com/ecell_nitk" className="bg-gray-700 p-2 rounded-full">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									xmlns:xlink="http://www.w3.org/1999/xlink"
									version="1.1" id="Layer_1" width="20px" height="20px" viewBox="0 0 24 24"
									stroke="currentColor" xml:space="preserve">
									<path d="M14.095479,10.316482L22.286354,1h-1.940718l-7.115352,8.087682L7.551414,1H1l8.589488,12.231093L1,23h1.940717  l7.509372-8.542861L16.448587,23H23L14.095479,10.316482z M11.436522,13.338465l-0.871624-1.218704l-6.924311-9.68815h2.981339  l5.58978,7.82155l0.867949,1.218704l7.26506,10.166271h-2.981339L11.436522,13.338465z" />
								</svg>

							</a>

						</div>
					</div>

					<div className="mb-8 md:mb-0">
						<h3 className="text-lg font-semibold mb-4">Quick Links</h3>
						<div className="flex flex-row md:space-x-4 gap-10 md:gap-0 lg:gap-16">
							<ul className="space-y-2 mb-4 md:mb-0">
								<li>
									<Link to="/" className="hover:text-gray-300">
										Home
									</Link>
								</li>
								<li>
									<Link to="/events" className="hover:text-gray-300">
										Events
									</Link>
								</li>
								<li>
									<a href="https://drive.google.com/file/d/1lz1-6UzJwaIfb40gVf7eo2u3Y8bx6OPl/view?usp=sharing" target="_blank" className="hover:text-gray-300">
										Brochure
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-gray-300">
										Accomodation
									</a>
								</li>
							</ul>
							<ul className="space-y-2">
								<li>
									<Link to="/gallery" className="hover:text-gray-300">
										Gallery
									</Link>
								</li>
								<li>
									<Link to="/contact" className="hover:text-gray-300">
										Contact
									</Link>
								</li>
								<li>
									<Link to="/team" className="hover:text-gray-300">
										Team
									</Link>
								</li>
							</ul>
						</div>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4">Contact Us</h3>
						<ul className="space-y-2">
							<li className="flex items-center">
								<span className="mr-2">📧</span>
								<a
									href="mailto:ecell@nitk.edu.in"
									className="hover:text-gray-300 break-all"
								>
									ecell@nitk.edu.in
								</a>
							</li>
							<li className="flex items-center">
								<span className="mr-2">📞</span>
								<div className="">
									<a href="tel:+919574212640" className="hover:text-gray-300">
										E-Cell Outreach Manager +91 95742-12640
									</a>
									<br />
									<a href="tel:+918294766495" className="hover:text-gray-300">
										incub8 Marketing Head +91 82947-66495
									</a>
								</div>
							</li>
							<li className="flex items-start">
								<span className="mr-2">📍</span>
								<p>
									NITK, NH 66,
									<br />
									Srinivasnagar,
									<br />
									Surathkal Mangalore,
									<br />
									Karnataka - 575025
								</p>
							</li>
						</ul>
					</div>
				</div>
			</footer >
		</>
	);
}

