PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('Customer', 'Administrator', 'Guide')) DEFAULT 'Customer',
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO Users VALUES(1,'admin@bharatyatra.com','pbkdf2:sha256:600000$c1e2f3a4$92b3a88631527efad7845f0724888d3d9e48f86ec55e6e3ce5df7a86985a9df6','Administrator',1,'2026-10-11 16:06:12','2026-10-11 16:06:12');
INSERT INTO Users VALUES(2,'rajesh.guide@bharatyatra.com','pbkdf2:sha256:600000$c1e2f3a4$92b3a88631527efad7845f0724888d3d9e48f86ec55e6e3ce5df7a86985a9df6','Guide',1,'2026-10-11 16:06:12','2026-10-11 16:06:12');
INSERT INTO Users VALUES(3,'ananya.guide@bharatyatra.com','pbkdf2:sha256:600000$c1e2f3a4$92b3a88631527efad7845f0724888d3d9e48f86ec55e6e3ce5df7a86985a9df6','Guide',1,'2026-10-11 16:06:12','2026-10-11 16:06:12');
INSERT INTO Users VALUES(4,'vikram.guide@bharatyatra.com','pbkdf2:sha256:600000$c1e2f3a4$92b3a88631527efad7845f0724888d3d9e48f86ec55e6e3ce5df7a86985a9df6','Guide',1,'2026-10-11 16:06:12','2026-10-11 16:06:12');
INSERT INTO Users VALUES(5,'arjun.sharma@gmail.com','pbkdf2:sha256:600000$c1e2f3a4$92b3a88631527efad7845f0724888d3d9e48f86ec55e6e3ce5df7a86985a9df6','Customer',1,'2026-10-11 16:06:12','2026-10-11 16:06:12');
INSERT INTO Users VALUES(6,'priya.nair@outlook.com','pbkdf2:sha256:600000$c1e2f3a4$92b3a88631527efad7845f0724888d3d9e48f86ec55e6e3ce5df7a86985a9df6','Customer',1,'2026-10-11 16:06:12','2026-10-11 16:06:12');
INSERT INTO Users VALUES(7,'rohit.verma@yahoo.com','pbkdf2:sha256:600000$c1e2f3a4$92b3a88631527efad7845f0724888d3d9e48f86ec55e6e3ce5df7a86985a9df6','Customer',1,'2026-10-11 16:06:12','2026-10-11 16:06:12');
INSERT INTO Users VALUES(8,'sneha.patel@gmail.com','pbkdf2:sha256:600000$c1e2f3a4$92b3a88631527efad7845f0724888d3d9e48f86ec55e6e3ce5df7a86985a9df6','Customer',1,'2026-10-11 16:06:12','2026-10-11 16:06:12');
INSERT INTO Users VALUES(9,'jashwanthsappidi23@gmail.com','$pbkdf2-sha256$29000$nDMGAIAwhjDGeM.ZsxZiLA$ngwhVXBe6ka8HXe4i8UDYsfGW.QsV3i1z6jBimm1wGg','Customer',1,'2026-10-11 16:35:44.194723','2026-10-11 16:35:44.194785');
INSERT INTO Users VALUES(10,'jeanluc.guide@bharatyatra.com','pbkdf2:sha256:600000$c1e2f3a4$92b3a88631527efad7845f0724888d3d9e48f86ec55e6e3ce5df7a86985a9df6','Guide',1,'2026-10-11 16:57:40','2026-10-11 16:57:40');
INSERT INTO Users VALUES(11,'kenji.guide@bharatyatra.com','pbkdf2:sha256:600000$c1e2f3a4$92b3a88631527efad7845f0724888d3d9e48f86ec55e6e3ce5df7a86985a9df6','Guide',1,'2026-10-11 16:57:40','2026-10-11 16:57:40');
INSERT INTO Users VALUES(12,'wayan.guide@bharatyatra.com','pbkdf2:sha256:600000$c1e2f3a4$92b3a88631527efad7845f0724888d3d9e48f86ec55e6e3ce5df7a86985a9df6','Guide',1,'2026-10-11 16:57:40','2026-10-11 16:57:40');
INSERT INTO Users VALUES(13,'tariq.guide@bharatyatra.com','pbkdf2:sha256:600000$c1e2f3a4$92b3a88631527efad7845f0724888d3d9e48f86ec55e6e3ce5df7a86985a9df6','Guide',1,'2026-10-11 16:57:40','2026-10-11 16:57:40');
INSERT INTO Users VALUES(14,'sarah.guide@bharatyatra.com','pbkdf2:sha256:600000$c1e2f3a4$92b3a88631527efad7845f0724888d3d9e48f86ec55e6e3ce5df7a86985a9df6','Guide',1,'2026-10-11 16:57:40','2026-10-11 16:57:40');
CREATE TABLE Customers (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT,
    state TEXT,
    emergency_contact TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
INSERT INTO Customers VALUES(1,5,'Arjun Sharma','+91 98765 43210','Bengaluru','Karnataka','+91 98765 43219','2026-10-11 16:06:12');
INSERT INTO Customers VALUES(2,6,'Priya Nair','+91 98234 56789','Kochi','Kerala','+91 98234 56780','2026-10-11 16:06:12');
INSERT INTO Customers VALUES(3,7,'Rohit Verma','+91 97123 45678','Mumbai','Maharashtra','+91 97123 45670','2026-10-11 16:06:12');
INSERT INTO Customers VALUES(4,8,'Sneha Patel','+91 99887 76655','Ahmedabad','Gujarat','+91 99887 76650','2026-10-11 16:06:12');
INSERT INTO Customers VALUES(5,9,'Jashwanth sappidi','9398268825',NULL,NULL,NULL,'2026-10-11 16:35:44.197165');
CREATE TABLE Destinations (
    destination_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    state TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',
    description TEXT,
    image_url TEXT,
    is_popular INTEGER NOT NULL DEFAULT 0,
    best_time_to_visit TEXT
, continent TEXT, country_id INTEGER);
INSERT INTO Destinations VALUES(1,'Goa','Goa','India','India’s beach haven famous for golden sands, vibrant nightlife, Portuguese heritage, and seafood.','https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',1,'Nov to Feb','Asia',23);
INSERT INTO Destinations VALUES(2,'Manali','Himachal Pradesh','India','Picturesque hill retreat cradled in snow-capped Pir Panjal peaks, pine forests, and adventure valleys.','https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',1,'Oct to Jun','Asia',23);
INSERT INTO Destinations VALUES(3,'Kashmir','Jammu & Kashmir','India','Paradise on Earth boasting scenic Dal Lake shikaras, Mughal gardens, and snow-laden Gulmarg slopes.','https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80',1,'Apr to Oct / Dec to Feb','Asia',23);
INSERT INTO Destinations VALUES(4,'Kerala','Kerala','India','God’s Own Country with serene backwaters, aromatic tea plantations in Munnar, and Ayurvedic wellness.','https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',1,'Sep to Mar','Asia',23);
INSERT INTO Destinations VALUES(5,'Jaipur','Rajasthan','India','The Pink City steeped in royal Rajput history, grand hill forts, Amber Palace, and traditional bazaars.','https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',1,'Oct to Mar','Asia',23);
INSERT INTO Destinations VALUES(6,'Agra','Uttar Pradesh','India','Home to the magnificent Taj Mahal, Agra Fort, and exquisite Mughal marble architectural legacy.','https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',1,'Oct to Mar','Asia',23);
INSERT INTO Destinations VALUES(7,'Varanasi','Uttar Pradesh','India','One of the world’s oldest living spiritual hubs on the sacred Ganges, renowned for soulful evening aartis.','https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',1,'Nov to Feb','Asia',23);
INSERT INTO Destinations VALUES(8,'Andaman','Andaman & Nicobar','India','Exotic tropical archipelago with crystal azure waters, Radhanagar beach, and vibrant coral reefs.','https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',1,'Oct to May','Asia',23);
INSERT INTO Destinations VALUES(9,'Ooty','Tamil Nadu','India','Queen of Nilgiri Hill Stations famous for misty tea gardens, botanical gardens, and heritage mountain train.','https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',1,'Mar to Jun / Sep to Nov','Asia',23);
INSERT INTO Destinations VALUES(10,'Udaipur','Rajasthan','India','City of Lakes renowned for dreamy palaces floating on Lake Pichola, Mewar history, and romantic courtyards.','https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',1,'Oct to Mar','Asia',23);
INSERT INTO Destinations VALUES(11,'Paris','Île-de-France','France','The world-renowned City of Light celebrated for the Eiffel Tower, Louvre Museum, haute cuisine, and romantic Seine cruises.','https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',1,'Apr to Oct','Europe',1);
INSERT INTO Destinations VALUES(12,'Interlaken and Lucerne','Bern & Lucerne','Switzerland','Alpine paradise nestled between crystal lakes Thun and Brienz, gateway to Jungfraujoch, Mount Pilatus, and scenic cogwheel trains.','https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',1,'Jun to Sep / Dec to Mar','Europe',2);
INSERT INTO Destinations VALUES(13,'Bali','Bali Province','Indonesia','Tropical haven featuring lush emerald rice terraces of Ubud, ancient cliffside Uluwatu temples, beaches, and scenic waterfalls.','https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',1,'Apr to Oct','Asia',3);
INSERT INTO Destinations VALUES(14,'Tokyo and Kyoto','Kanto & Kansai','Japan','The ultimate blend of hyper-modern neon skyline in Tokyo and serene centuries-old Zen shrines, bamboo groves, and geisha districts in Kyoto.','https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',1,'Mar to May / Sep to Nov','Asia',4);
INSERT INTO Destinations VALUES(15,'Dubai','Emirate of Dubai','United Arab Emirates','Ultra-modern desert metropolis known for Burj Khalifa, opulent shopping malls, gold souks, luxury yacht marinas, and desert safaris.','https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',1,'Nov to Mar','Asia',5);
INSERT INTO Destinations VALUES(16,'Maldives','Malé Atolls','Maldives','Pristine archipelago of coral atolls with overwater bungalows, turquoise lagoons, world-class coral reef diving, and serene beaches.','https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',1,'Nov to Apr','Asia',6);
INSERT INTO Destinations VALUES(17,'New York','New York','USA','The vibrant Empire City with iconic landmarks like Times Square, Central Park, Broadway theatres, and the Statue of Liberty.','https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',1,'Apr to Jun / Sep to Nov','North America',7);
INSERT INTO Destinations VALUES(18,'Sydney','New South Wales','Australia','Sun-kissed coastal harbour city famous for the architectural marvel Sydney Opera House, Harbour Bridge climb, and Bondi Beach surf.','https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',1,'Sep to Nov / Mar to May','Oceania',8);
INSERT INTO Destinations VALUES(19,'Cape Town','Western Cape','South Africa','Dramatic coastal city set against flat-topped Table Mountain, picturesque Cape Point peninsula, penguin colonies, and vineyards.','https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',1,'Nov to Mar','Africa',9);
INSERT INTO Destinations VALUES(20,'Rio de Janeiro','Rio de Janeiro','Brazil','Marvelous city cradled between mountains and ocean, famous for Christ the Redeemer atop Corcovado, Sugarloaf Cable Car, and Copacabana.','https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80',1,'Dec to Mar','South America',10);
INSERT INTO Destinations VALUES(21,'London','Greater London','United Kingdom','Historic capital on the Thames with Big Ben, the Tower of London, Buckingham Palace, West End theatres, and royal parks.','https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',1,'May to Sep','Europe',11);
INSERT INTO Destinations VALUES(22,'Rome','Lazio','Italy','The Eternal City boasting 28 centuries of history, the Colosseum, Vatican City, St. Peter''s Basilica, and the Trevi Fountain.','https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',1,'Apr to Jun / Sep to Oct','Europe',12);
INSERT INTO Destinations VALUES(23,'Barcelona','Catalonia','Spain','Mediterranean cultural hub famous for Antoni Gaudí''s Sagrada Família, Park Güell, gothic quarters, and lively beach promenades.','https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',1,'May to Jun / Sep to Oct','Europe',13);
INSERT INTO Destinations VALUES(24,'Santorini','South Aegean','Greece','Postcard-perfect volcanic island in the Cyclades with whitewashed cliffside villages, blue-domed churches, and famous Oia sunsets.','https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',1,'May to Oct','Europe',14);
INSERT INTO Destinations VALUES(25,'Amsterdam','North Holland','Netherlands','Charming canal-ringed city famous for historic bridges, Rijksmuseum, Van Gogh Museum, cycling culture, and spring tulip gardens.','https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=800&q=80',1,'Apr to Sep','Europe',15);
INSERT INTO Destinations VALUES(26,'Istanbul','Marmara','Türkiye','Transcontinental historic crossroad bridging Europe and Asia across the Bosphorus, home to Hagia Sophia, Blue Mosque, and Grand Bazaar.','https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80',1,'Apr to May / Sep to Nov','Europe / Asia',16);
INSERT INTO Destinations VALUES(27,'Bangkok','Central Thailand','Thailand','Vibrant capital of ornate shrines like Wat Arun, Grand Palace, lively floating markets, buzzing street food, and Chao Phraya river life.','https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80',1,'Nov to Feb','Asia',17);
INSERT INTO Destinations VALUES(28,'Phuket','Phuket Province','Thailand','Thailand''s premier tropical island with Andaman emerald waters, Patong nightlife, Phi Phi Island day cruises, and big Buddha.','https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80',1,'Nov to Apr','Asia',17);
INSERT INTO Destinations VALUES(29,'Singapore','Central Region','Singapore','Futuristic garden city state featuring Marina Bay Sands, Gardens by the Bay Supertree Grove, Sentosa Island, and Michelin street food.','https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',1,'Year-round','Asia',18);
INSERT INTO Destinations VALUES(30,'Kuala Lumpur','Federal Territory','Malaysia','Dynamic metropolis crowned by the soaring 88-storey Petronas Twin Towers, Batu Caves shrine, and vibrant Bukit Bintang shopping.','https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',1,'May to Jul / Dec to Feb','Asia',19);
INSERT INTO Destinations VALUES(31,'Seoul','Seoul Capital Area','South Korea','Trendsetting capital harmonizing Gyeongbokgung royal palace with high-tech K-culture, Myeongdong shopping, and N Seoul Tower vistas.','https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800&q=80',1,'Mar to May / Sep to Nov','Asia',20);
INSERT INTO Destinations VALUES(32,'Kathmandu','Bagmati Province','Nepal','Mystical Himalayan valley city filled with UNESCO durbar squares, ancient stupas like Swayambhunath, and gateway to Everest treks.','https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',0,'Oct to Dec / Mar to Apr','Asia',21);
INSERT INTO Destinations VALUES(33,'Colombo','Western Province','Sri Lanka','Coastal commercial capital combining colonial Dutch architecture, oceanfront Galle Face Green, bustling Pettah bazaars, and Buddhist temples.','https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',0,'Dec to Mar','Asia',22);
INSERT INTO Destinations VALUES(34,'Abu Dhabi','Emirate of Abu Dhabi','United Arab Emirates','UAE capital known for the majestic Sheikh Zayed Grand Mosque, Louvre Abu Dhabi on Saadiyat Island, and Ferrari World thrills.','https://images.unsplash.com/photo-1512632570417-a6096acb0797?auto=format&fit=crop&w=800&q=80',0,'Nov to Mar','Asia',5);
INSERT INTO Destinations VALUES(35,'Doha','Ad-Dawhah','Qatar','Arabian Gulf pearl featuring Museum of Islamic Art, futuristic skyline of West Bay, and the traditional atmospheric Souq Waqif.','https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80',0,'Nov to Mar','Asia',24);
INSERT INTO Destinations VALUES(36,'Los Angeles','California','USA','Entertainment capital of the world, home to Hollywood Walk of Fame, Santa Monica Pier, Beverly Hills, and Universal Studios.','https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=800&q=80',1,'Mar to May / Sep to Nov','North America',7);
INSERT INTO Destinations VALUES(37,'Las Vegas','Nevada','USA','Neon-lit entertainment oasis in the Mojave Desert famed for themed luxury resort casinos, world-class nightlife, and Bellagio fountains.','https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?auto=format&fit=crop&w=800&q=80',0,'Mar to May / Sep to Nov','North America',7);
INSERT INTO Destinations VALUES(38,'Toronto','Ontario','Canada','Cosmopolitan Canadian cultural capital featuring the iconic CN Tower, waterfront Toronto Islands, and gateway to Niagara Falls.','https://images.unsplash.com/photo-1507992781348-310259076fa0?auto=format&fit=crop&w=800&q=80',0,'May to Oct','North America',25);
INSERT INTO Destinations VALUES(39,'Vancouver','British Columbia','Canada','Stunning Pacific coast city surrounded by coastal mountains, Stanley Park seawall, Capilano Suspension Bridge, and Granville Island.','https://images.unsplash.com/photo-1559511260-66a65e09b245?auto=format&fit=crop&w=800&q=80',0,'Jun to Sep','North America',25);
INSERT INTO Destinations VALUES(40,'Cancún','Quintana Roo','Mexico','Caribbean resort paradise on Yucatan Peninsula featuring white sand beaches, turquoise Caribbean waters, and nearby Mayan Chichén Itzá.','https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80',1,'Dec to Apr','North America',26);
INSERT INTO Destinations VALUES(41,'Havana','La Habana','Cuba','Vibrant historic Caribbean capital celebrated for vintage 1950s classic cars, Old Havana colonial plazas, live salsa music, and Malecon.','https://images.unsplash.com/photo-1500759285222-a95626b934cb?auto=format&fit=crop&w=800&q=80',0,'Dec to May','North America',27);
INSERT INTO Destinations VALUES(42,'Cusco and Machu Picchu','Cusco Region','Peru','Ancient heart of the Inca Empire set high in the Andes, gateway to the mystical stone citadel of Machu Picchu and Sacred Valley.','https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80',1,'May to Oct','South America',28);
INSERT INTO Destinations VALUES(43,'Buenos Aires','Buenos Aires','Argentina','The Paris of South America, famed for passionate tango dance halls, grand European architecture, colorful La Boca, and world-class steakhouses.','https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=800&q=80',0,'Oct to Dec / Mar to May','South America',29);
INSERT INTO Destinations VALUES(44,'Santiago','Santiago Metropolitan','Chile','Andean capital nestled against snow-capped peaks, renowned for hilltop parks, Bohemian Bellavista, and nearby Maipo wine valleys.','https://images.unsplash.com/photo-1579208575657-c595a05383b7?auto=format&fit=crop&w=800&q=80',0,'Sep to Nov / Mar to May','South America',30);
INSERT INTO Destinations VALUES(45,'Queenstown','Otago','New Zealand','Global adventure capital on Lake Wakatipu, surrounded by the Remarkables mountains, famous for bungee jumping, jet boating, and Milford Sound.','https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=800&q=80',1,'Dec to Feb / Jun to Aug','Oceania',31);
INSERT INTO Destinations VALUES(46,'Melbourne','Victoria','Australia','Cultural and culinary capital renowned for street art laneways, heritage tram network, Melbourne Cricket Ground, and Great Ocean Road.','https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=800&q=80',0,'Mar to May / Sep to Nov','Oceania',8);
INSERT INTO Destinations VALUES(47,'Cairo','Cairo Governorate','Egypt','Ancient gateway to the Nile boasting the Great Pyramids of Giza, the enigmatic Sphinx, the Grand Egyptian Museum, and Khan el-Khalili bazaar.','https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80',1,'Oct to Apr','Africa',32);
INSERT INTO Destinations VALUES(48,'Marrakech','Marrakesh-Safi','Morocco','The Red City famous for the sensory buzz of Jemaa el-Fnaa square, ancient medina souks, Majorelle Garden, and Bahia Palace.','https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=800&q=80',0,'Oct to Apr','Africa',33);
INSERT INTO Destinations VALUES(49,'Zanzibar','Unguja','Tanzania','Spice Island paradise in the Indian Ocean with pristine white sand beaches of Nungwi, coral reefs, and the UNESCO labyrinth of Stone Town.','https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',1,'Jun to Oct / Dec to Feb','Africa',34);
INSERT INTO Destinations VALUES(50,'Nairobi','Nairobi County','Kenya','Safari capital of East Africa where wildlife thrives against a skyline, featuring Nairobi National Park, giraffe sanctuary, and elephant orphanage.','https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80',0,'Jul to Oct / Jan to Feb','Africa',35);
INSERT INTO Destinations VALUES(51,'Reykjavík','Capital Region','Iceland','Northern lights haven and gateway to the Golden Circle, geothermal Blue Lagoon, dramatic waterfalls, and volcanic geysers.','https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',1,'Jun to Aug / Sep to Mar','Europe',36);
INSERT INTO Destinations VALUES(52,'Prague','Bohemia','Czechia','The City of a Hundred Spires renowned for Charles Bridge, Prague Castle, astronomical clock, and Gothic-Baroque historic streets.','https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=800&q=80',0,'May to Sep','Europe',37);
INSERT INTO Destinations VALUES(53,'Vienna','Vienna State','Austria','Imperial capital of classical music, grand Schönbrunn and Hofburg palaces, historic coffeehouses, and Danube river elegance.','https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=800&q=80',0,'Apr to May / Sep to Oct','Europe',38);
INSERT INTO Destinations VALUES(54,'Fiji Islands','Western Division','Fiji','South Pacific tropical paradise comprising over 300 idyllic islands, soft coral diving, friendly Bula hospitality, and private island coves.','https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',0,'May to Oct','Oceania',39);
INSERT INTO Destinations VALUES(55,'Petra','Ma’an Governorate','Jordan','The rose-red ancient Nabataean wonder carved into sheer canyon rock faces, featuring the Treasury (Al-Khazneh) and the Monastery.','https://images.unsplash.com/photo-1579606032834-deaff9700c5b?auto=format&fit=crop&w=800&q=80',1,'Mar to May / Sep to Nov','Asia',40);
CREATE TABLE PackageDestinations (
    package_id INTEGER NOT NULL,
    destination_id INTEGER NOT NULL,
    sequence_order INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (package_id, destination_id),
    FOREIGN KEY (package_id) REFERENCES TourPackages(package_id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES Destinations(destination_id) ON DELETE CASCADE
);
INSERT INTO PackageDestinations VALUES(1,3,1);
INSERT INTO PackageDestinations VALUES(2,1,1);
INSERT INTO PackageDestinations VALUES(3,4,1);
INSERT INTO PackageDestinations VALUES(4,5,1);
INSERT INTO PackageDestinations VALUES(4,10,2);
INSERT INTO PackageDestinations VALUES(5,2,1);
INSERT INTO PackageDestinations VALUES(6,7,1);
INSERT INTO PackageDestinations VALUES(7,8,1);
INSERT INTO PackageDestinations VALUES(8,9,1);
INSERT INTO PackageDestinations VALUES(9,6,1);
INSERT INTO PackageDestinations VALUES(9,5,2);
INSERT INTO PackageDestinations VALUES(10,10,1);
INSERT INTO PackageDestinations VALUES(11,5,1);
INSERT INTO PackageDestinations VALUES(12,1,1);
INSERT INTO PackageDestinations VALUES(13,7,1);
INSERT INTO PackageDestinations VALUES(14,4,1);
INSERT INTO PackageDestinations VALUES(15,3,1);
INSERT INTO PackageDestinations VALUES(16,11,1);
INSERT INTO PackageDestinations VALUES(17,12,1);
INSERT INTO PackageDestinations VALUES(18,13,1);
INSERT INTO PackageDestinations VALUES(19,14,1);
INSERT INTO PackageDestinations VALUES(20,15,1);
INSERT INTO PackageDestinations VALUES(21,16,1);
INSERT INTO PackageDestinations VALUES(22,17,1);
INSERT INTO PackageDestinations VALUES(23,18,1);
INSERT INTO PackageDestinations VALUES(24,19,1);
INSERT INTO PackageDestinations VALUES(25,20,1);
INSERT INTO PackageDestinations VALUES(26,3,1);
INSERT INTO PackageDestinations VALUES(27,4,1);
INSERT INTO PackageDestinations VALUES(28,9,1);
INSERT INTO PackageDestinations VALUES(29,2,1);
INSERT INTO PackageDestinations VALUES(30,1,1);
INSERT INTO PackageDestinations VALUES(31,27,1);
INSERT INTO PackageDestinations VALUES(31,28,2);
INSERT INTO PackageDestinations VALUES(32,29,1);
CREATE TABLE Hotels (
    hotel_id INTEGER PRIMARY KEY AUTOINCREMENT,
    destination_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    star_rating INTEGER NOT NULL CHECK(star_rating BETWEEN 1 AND 5) DEFAULT 3,
    address TEXT,
    contact_phone TEXT,
    amenities TEXT,
    FOREIGN KEY (destination_id) REFERENCES Destinations(destination_id) ON DELETE CASCADE
);
INSERT INTO Hotels VALUES(1,3,'Royal Dal Lake Houseboat & Resort',5,'Boulevard Road, Dal Lake, Srinagar','+91 194 2456789','Free Wi-Fi, Heating, Shikara Transfer, Lake View');
INSERT INTO Hotels VALUES(2,1,'Caravela Beach Resort Goa',5,'Varca Beach, South Goa','+91 832 6695000','Private Beach, Pool, Spa, Bar, Multi-cuisine Restaurant');
INSERT INTO Hotels VALUES(3,4,'Munnar Tea Hills Luxury Hideaway',4,'Chinnakanal, Munnar, Kerala','+91 486 8249000','Tea Garden View, Campfire, Free Wi-Fi, Restaurant');
INSERT INTO Hotels VALUES(4,5,'Rajputana Heritage Haveli Jaipur',4,'Civil Lines, Jaipur, Rajasthan','+91 141 4056700','Pool, Cultural Folk Dances, Rajasthani Cuisine');
INSERT INTO Hotels VALUES(5,2,'Solang Valley Mountain Resort',4,'Solang Valley, Manali, Himachal','+91 190 2256000','Snow View, Paragliding Assistance, Heating');
INSERT INTO Hotels VALUES(6,7,'Ganga Heritage Ghat Retreat',4,'Dashashwamedh Ghat, Varanasi','+91 542 2278900','River View Terraces, Pure Veg Restaurant, Aarti Deck');
INSERT INTO Hotels VALUES(7,8,'Havelock Island Coral Sands Resort',5,'Beach No. 5, Havelock Island, Andaman','+91 319 2282000','Private Beach, Dive Centre, Coral Reef Access');
INSERT INTO Hotels VALUES(8,9,'Nilgiri Heritage Mist View Cottage',4,'Club Road, Ooty, Tamil Nadu','+91 423 2442000','Fireplace, Mountain Lawn, Tea Tasting');
INSERT INTO Hotels VALUES(9,6,'Crystal Taj Grand View',5,'Fatehabad Road, Agra, UP','+91 562 4050000','Taj Mahal View Rooftop, Swimming Pool, Spa');
INSERT INTO Hotels VALUES(10,10,'Lake Palace View Courtyard',5,'Haridas Ji Ki Magri, Udaipur','+91 294 2432000','Lake Pichola Terrace, Folk Music, Heritage Suites');
INSERT INTO Hotels VALUES(11,11,'Hotel Le Marais Prestige',4,'15 Rue de Rivoli, Paris, France','+33 1 42 68 55 00','Free Wi-Fi, Rooftop Cafe, Seine View, Elevator, Concierge');
INSERT INTO Hotels VALUES(12,12,'Hotel Schweizerhof Interlaken',5,'Höheweg 37, Interlaken, Switzerland','+41 33 827 51 00','Spa, Alpine Mountain View, Heated Pool, Fine Dining, Free Rail Shuttle');
INSERT INTO Hotels VALUES(13,13,'Ubud Valley Forest Resort',5,'Jl. Raya Sebali, Ubud, Bali, Indonesia','+62 361 9081234','Private Infinity Pool, Spa, Yoga Deck, Organic Breakfast, Rice Field View');
INSERT INTO Hotels VALUES(14,14,'Kyoto Imperial Grand Hotel',4,'Shimogyo-ku, Kyoto, Japan','+81 75 341 1122','Traditional Onsen Bath, Garden View, Shinkansen Shuttle, Free Wi-Fi, Japanese Tea Lounge');
INSERT INTO Hotels VALUES(15,15,'Marina Waterfront Luxury Hotel',5,'Dubai Marina Walk, Dubai, UAE','+971 4 436 7777','Marina View, Private Yacht Berth, Infinity Pool, Rooftop Lounge, Valet Parking');
INSERT INTO Hotels VALUES(16,16,'Sun Island Lagoon Overwater Resort',5,'South Ari Atoll, Maldives','+960 668 0088','Overwater Villa, Glass Floor, Direct Lagoon Access, Snorkeling Reef, All-Inclusive Dining');
INSERT INTO Hotels VALUES(17,17,'The Manhattan Grand Central Hotel',4,'Lexington Ave & 42nd St, New York, USA','+1 212 661 9600','City View, 24/7 Fitness Centre, Concierge, Grand Central Access, High-Speed Wi-Fi');
INSERT INTO Hotels VALUES(18,18,'Sydney Harbour Marriott & Suite',5,'30 Pitt Street, Sydney, Australia','+61 2 9259 7000','Opera House View, Heated Indoor Pool, Spa, Harbour Chauffeur, Multi-cuisine Restaurant');
INSERT INTO Hotels VALUES(19,19,'Table Mountain Protea Haven',4,'Buitengracht St, Cape Town, South Africa','+27 21 418 1234','Table Mountain View, Pool, Wine Bar, Tour Desk, Airport Shuttle');
INSERT INTO Hotels VALUES(20,20,'Copacabana Palace Sands Hotel',5,'Avenida Atlântica 1702, Rio de Janeiro, Brazil','+55 21 2548 7070','Oceanfront Terrace, Pool, Piano Bar, Private Beach Loungers, 24/7 Concierge');
CREATE TABLE Guides (
    guide_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    languages TEXT NOT NULL,
    experience_years INTEGER NOT NULL CHECK(experience_years >= 0) DEFAULT 1,
    bio TEXT,
    is_available INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
INSERT INTO Guides VALUES(1,2,'Rajesh Sharma','+91 98112 34567','rajesh.guide@bharatyatra.com','Hindi, English, Kashmiri',8,'Senior certified tour guide with over 8 years in Kashmir and Himalayan mountain routes.',1);
INSERT INTO Guides VALUES(2,3,'Ananya Shenoy','+91 98456 78901','ananya.guide@bharatyatra.com','Hindi, English, Konkani, Malayalam',6,'Specialist in Western Ghats, Kerala backwaters, and Portuguese heritage architecture in Goa.',1);
INSERT INTO Guides VALUES(3,4,'Vikram Rathore','+91 98291 23456','vikram.guide@bharatyatra.com','Hindi, English, Rajasthani',10,'Historian and storyteller expert in Rajasthan forts, Mughal monuments, and Varanasi spiritual heritage.',1);
INSERT INTO Guides VALUES(4,10,'Jean-Luc Dubois','+33 6 12 34 56 78','jeanluc.guide@bharatyatra.com','English, French, German',9,'Certified European tour director with 9 years guiding tours across France and the Swiss Alps.',1);
INSERT INTO Guides VALUES(5,11,'Kenji Sato','+81 90 1234 5678','kenji.guide@bharatyatra.com','English, Japanese',8,'Tokyo and Kyoto licensed cultural specialist and Mount Fuji certified mountain leader.',1);
INSERT INTO Guides VALUES(6,12,'Wayan Sudarta','+62 81 2345 6789','wayan.guide@bharatyatra.com','English, Indonesian, Balinese',7,'Balinese native naturalist and cultural guide specializing in Ubud heritage and ocean temples.',1);
INSERT INTO Guides VALUES(7,13,'Tariq Al-Mansoor','+971 50 123 4567','tariq.guide@bharatyatra.com','English, Arabic, Hindi',6,'Dubai Department of Tourism licensed guide expert in desert safaris and Arabian architectural marvels.',1);
INSERT INTO Guides VALUES(8,14,'Sarah Jenkins','+61 412 345 678','sarah.guide@bharatyatra.com','English, Spanish',8,'International adventure expedition leader with extensive tours across Sydney, New York, and South Africa.',1);
CREATE TABLE Departures (
    departure_id INTEGER PRIMARY KEY AUTOINCREMENT,
    package_id INTEGER NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    total_capacity INTEGER NOT NULL CHECK(total_capacity > 0),
    confirmed_seats INTEGER NOT NULL CHECK(confirmed_seats >= 0 AND confirmed_seats <= total_capacity) DEFAULT 0,
    price_override REAL NULL,
    guide_id INTEGER NULL,
    transport_id INTEGER NULL,
    status TEXT NOT NULL CHECK(status IN ('Draft', 'Published', 'Confirmed', 'Completed', 'Cancelled')) DEFAULT 'Published',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CHECK (end_date >= start_date),
    FOREIGN KEY (package_id) REFERENCES TourPackages(package_id) ON DELETE CASCADE,
    FOREIGN KEY (guide_id) REFERENCES Guides(guide_id) ON DELETE SET NULL,
    FOREIGN KEY (transport_id) REFERENCES Transport(transport_id) ON DELETE SET NULL
);
INSERT INTO Departures VALUES(1,1,'2026-11-05','2026-11-10',20,14,28999.0,1,1,'Confirmed','2026-10-11 16:06:12');
INSERT INTO Departures VALUES(2,1,'2026-11-20','2026-11-25',20,8,28999.0,1,1,'Published','2026-10-11 16:06:12');
INSERT INTO Departures VALUES(3,2,'2026-11-12','2026-11-16',25,20,18499.0,2,2,'Confirmed','2026-10-11 16:06:12');
INSERT INTO Departures VALUES(4,2,'2026-12-01','2026-12-05',25,6,19999.0,2,2,'Published','2026-10-11 16:06:12');
INSERT INTO Departures VALUES(5,3,'2026-11-15','2026-11-20',15,12,24500.0,2,3,'Confirmed','2026-10-11 16:06:12');
INSERT INTO Departures VALUES(6,4,'2026-11-18','2026-11-24',30,26,32000.0,3,4,'Confirmed','2026-10-11 16:06:12');
INSERT INTO Departures VALUES(7,5,'2026-11-10','2026-11-14',18,15,16999.0,1,5,'Confirmed','2026-10-11 16:06:12');
INSERT INTO Departures VALUES(8,6,'2026-11-08','2026-11-11',20,18,12500.0,3,4,'Confirmed','2026-10-11 16:06:12');
INSERT INTO Departures VALUES(9,7,'2026-12-10','2026-12-15',16,4,38500.0,2,2,'Published','2026-10-11 16:06:12');
INSERT INTO Departures VALUES(10,8,'2026-11-25','2026-11-28',15,0,14999.0,2,2,'Published','2026-10-11 16:06:12');
INSERT INTO Departures VALUES(11,16,'2026-11-10','2026-11-15',20,6,75000.0,4,6,'Confirmed','2026-10-11 16:57:40');
INSERT INTO Departures VALUES(12,16,'2026-12-05','2026-12-10',20,2,75000.0,4,6,'Published','2026-10-11 16:57:40');
INSERT INTO Departures VALUES(13,17,'2026-11-18','2026-11-25',18,8,150000.0,4,7,'Confirmed','2026-10-11 16:57:40');
INSERT INTO Departures VALUES(14,17,'2026-12-12','2026-12-19',18,4,150000.0,4,7,'Published','2026-10-11 16:57:40');
INSERT INTO Departures VALUES(15,18,'2026-11-08','2026-11-13',25,12,45000.0,6,8,'Confirmed','2026-10-11 16:57:40');
INSERT INTO Departures VALUES(16,18,'2026-12-01','2026-12-06',25,5,45000.0,6,8,'Published','2026-10-11 16:57:40');
INSERT INTO Departures VALUES(17,19,'2026-11-15','2026-11-22',20,10,120000.0,5,9,'Confirmed','2026-10-11 16:57:40');
INSERT INTO Departures VALUES(18,19,'2026-12-10','2026-12-17',20,4,120000.0,5,9,'Published','2026-10-11 16:57:40');
INSERT INTO Departures VALUES(19,20,'2026-11-05','2026-11-10',25,14,60000.0,7,10,'Confirmed','2026-10-11 16:57:40');
INSERT INTO Departures VALUES(20,20,'2026-11-22','2026-11-27',25,6,60000.0,7,10,'Published','2026-10-11 16:57:40');
INSERT INTO Departures VALUES(21,21,'2026-11-12','2026-11-16',16,8,85000.0,7,11,'Confirmed','2026-10-11 16:57:40');
INSERT INTO Departures VALUES(22,21,'2026-12-08','2026-12-12',16,2,85000.0,7,11,'Published','2026-10-11 16:57:40');
INSERT INTO Departures VALUES(23,22,'2026-11-20','2026-11-26',20,6,180000.0,8,12,'Confirmed','2026-10-11 16:57:40');
INSERT INTO Departures VALUES(24,23,'2026-11-24','2026-11-30',22,8,140000.0,8,13,'Confirmed','2026-10-11 16:57:40');
INSERT INTO Departures VALUES(25,24,'2026-12-02','2026-12-08',18,6,110000.0,8,14,'Confirmed','2026-10-11 16:57:40');
INSERT INTO Departures VALUES(26,25,'2026-12-15','2026-12-21',20,4,130000.0,8,15,'Published','2026-10-11 16:57:40');
INSERT INTO Departures VALUES(27,9,'2026-11-20','2026-11-26',25,6,32000.0,1,2,'Confirmed','2026-10-11 17:22:45');
INSERT INTO Departures VALUES(28,10,'2026-11-22','2026-11-26',20,4,28000.0,2,3,'Confirmed','2026-10-11 17:22:45');
INSERT INTO Departures VALUES(29,11,'2026-12-01','2026-12-05',18,5,35000.0,3,4,'Confirmed','2026-10-11 17:22:45');
INSERT INTO Departures VALUES(30,12,'2026-12-05','2026-12-09',24,8,22000.0,1,5,'Confirmed','2026-10-11 17:22:45');
INSERT INTO Departures VALUES(31,13,'2026-12-10','2026-12-14',30,10,18000.0,2,1,'Confirmed','2026-10-11 17:22:45');
INSERT INTO Departures VALUES(32,14,'2026-12-15','2026-12-19',20,4,25000.0,3,2,'Confirmed','2026-10-11 17:22:45');
INSERT INTO Departures VALUES(33,15,'2026-12-18','2026-12-25',16,6,48000.0,1,3,'Confirmed','2026-10-11 17:22:45');
INSERT INTO Departures VALUES(34,26,'2026-11-18','2026-11-23',20,6,32000.0,1,1,'Confirmed','2026-10-11 17:35:35');
INSERT INTO Departures VALUES(35,27,'2026-11-22','2026-11-27',25,8,27500.0,2,2,'Confirmed','2026-10-11 17:35:35');
INSERT INTO Departures VALUES(36,28,'2026-12-01','2026-12-06',20,4,29000.0,3,3,'Confirmed','2026-10-11 17:35:35');
INSERT INTO Departures VALUES(37,29,'2026-12-05','2026-12-10',25,7,22000.0,1,4,'Confirmed','2026-10-11 17:35:35');
INSERT INTO Departures VALUES(38,30,'2026-12-10','2026-12-13',30,12,14500.0,2,5,'Confirmed','2026-10-11 17:35:35');
INSERT INTO Departures VALUES(39,31,'2026-12-15','2026-12-20',20,5,54000.0,4,6,'Confirmed','2026-10-11 17:35:35');
INSERT INTO Departures VALUES(40,32,'2026-12-22','2026-12-26',18,6,72000.0,5,7,'Confirmed','2026-10-11 17:35:35');
CREATE TABLE ItineraryDays (
    itinerary_id INTEGER PRIMARY KEY AUTOINCREMENT,
    package_id INTEGER NOT NULL,
    day_number INTEGER NOT NULL CHECK(day_number > 0),
    title TEXT NOT NULL,
    activities TEXT NOT NULL,
    meals_included TEXT DEFAULT 'Breakfast',
    hotel_id INTEGER NULL,
    transport_id INTEGER NULL,
    notes TEXT,
    UNIQUE(package_id, day_number),
    FOREIGN KEY (package_id) REFERENCES TourPackages(package_id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES Hotels(hotel_id) ON DELETE SET NULL,
    FOREIGN KEY (transport_id) REFERENCES Transport(transport_id) ON DELETE SET NULL
);
INSERT INTO ItineraryDays VALUES(1,1,1,'Arrival in Srinagar & Dal Lake Shikara Ride','Welcome at Srinagar Airport, transfer to deluxe houseboat on Dal Lake. Enjoy a relaxing 1-hour sunset Shikara ride witnessing floating flower and vegetable markets.','Dinner',1,1,'Warm saffron kahwa served upon arrival.');
INSERT INTO ItineraryDays VALUES(2,1,2,'Mughal Gardens & Shankaracharya Temple','Visit Shalimar Bagh, Nishat Bagh, and Chashme Shahi built during Jahangir reign. Afternoon drive to historic Shankaracharya hilltop temple for panoramic city views.','Breakfast & Dinner',1,1,'Comfortable walking shoes recommended for garden stairs.');
INSERT INTO ItineraryDays VALUES(3,1,3,'Excursion to Gulmarg Meadow of Flowers','Scenic drive to Gulmarg. Ride the world’s second highest Gondola cable car up to Kongdoori and Apharwat Peak. Experience snow sports and sledging.','Breakfast & Dinner',1,1,'Gondola tickets to be booked in advance.');
INSERT INTO ItineraryDays VALUES(4,1,4,'Scenic Journey to Pahalgam Valley of Shepherds','Drive along saffron fields of Pampore and pine-shaded Lidder River. Explore Betaab Valley and Chandanwari surrounded by snow-draped alpine mountains.','Breakfast & Dinner',1,1,'Pony rides available locally in Baisaran meadow.');
INSERT INTO ItineraryDays VALUES(5,1,5,'Pahalgam Exploration & Return to Srinagar','Leisure morning beside gushing Lidder river streams. Return to Srinagar with visits to local walnut wood carving and Kashmiri pashmina weaving artisan workshops.','Breakfast & Dinner',1,1,'Authentic local shopping opportunities.');
INSERT INTO ItineraryDays VALUES(6,1,6,'Departure with Lifetime Memories','Enjoy morning breakfast overlooking Dal Lake misty waters. Transfer to Srinagar airport for homeward flight.','Breakfast',1,1,'Reach airport 2.5 hours prior to domestic departure.');
INSERT INTO ItineraryDays VALUES(101,16,1,'Arrival in Paris & Sunset Seine River Cruise','Arrive at Charles de Gaulle Airport, private transfer to boutique hotel. Evening 1-hour Seine River cruise past Notre-Dame and illuminated Eiffel Tower with welcome French champagne.','Dinner',11,6,'Romantic welcome drink on the boat deck.');
INSERT INTO ItineraryDays VALUES(102,16,2,'Iconic Eiffel Tower & Champ de Mars','Priority ascent to Eiffel Tower 2nd floor summit with panoramic Paris skyline views. Afternoon walk along Champ de Mars lawns and Trocadéro gardens.','Breakfast',11,6,'Best sunset photo spot at Place du Trocadéro.');
INSERT INTO ItineraryDays VALUES(103,16,3,'Louvre Museum Art Treasures & Tuileries Garden','Skip-the-line guided exploration of the Louvre Museum including the Mona Lisa, Venus de Milo, and Winged Victory. Stroll through Tuileries Garden to Place de la Concorde.','Breakfast',11,6,'Comfortable walking shoes recommended.');
INSERT INTO ItineraryDays VALUES(104,16,4,'Bohemian Montmartre & Sacré-Cœur Basilica','Funicular ride up Montmartre hill. Visit Sacré-Cœur Basilica, portrait artists at Place du Tertre, and classic Latin Quarter literary cafes.','Breakfast & Dinner',11,6,'Traditional French dinner in Saint-Germain.');
INSERT INTO ItineraryDays VALUES(105,16,5,'Champs-Élysées Promenade & Departure','Morning stroll past the Arc de Triomphe and luxury boutiques of Avenue des Champs-Élysées. Private transfer to airport for departure.','Breakfast',11,6,'Tax refund assistance at airport.');
INSERT INTO ItineraryDays VALUES(106,17,1,'Zurich Arrival & Scenic Rail Transfer to Lucerne','Arrive at Zurich Airport. Board the Swiss Federal Railways panorama train to Lucerne. Walk across historic Chapel Bridge and Old Town Lucerne.','Dinner',12,7,'First-class Swiss rail pass provided.');
INSERT INTO ItineraryDays VALUES(107,17,2,'Mount Pilatus Dragon Ride & Lake Lucerne Boat Cruise','Cruise across crystal Lake Lucerne, ascend world''s steepest cogwheel railway to Mount Pilatus summit (2,132m), and descend by aerial cableway.','Breakfast & Dinner',12,7,'Spectacular 360-degree Alpine panorama.');
INSERT INTO ItineraryDays VALUES(108,17,3,'GoldenPass Express Panoramic Journey to Interlaken','Scenic train journey over Brünig Pass to Interlaken cradled between Lake Thun and Lake Brienz. Leisure evening on Höheweg boulevard.','Breakfast',12,7,'Direct view of the snow-clad Jungfrau massif.');
INSERT INTO ItineraryDays VALUES(109,17,4,'Jungfraujoch — Top of Europe Glacier Expedition','Ride the state-of-the-art Eiger Express tricable gondola to Eigergletscher and cogwheel train through Eiger mountain to Jungfraujoch (3,454m). Explore Ice Palace and Sphinx Observatory.','Breakfast & Lunch',12,7,'Warm winter apparel and sunglasses essential.');
INSERT INTO ItineraryDays VALUES(110,17,5,'Crystal Waters of Lake Brienz & Giessbach Falls Hike','Steamboat cruise on turquoise Lake Brienz to Giessbach hotel. Hike under roaring multi-tiered Giessbach waterfall and visit Brienz woodcarving village.','Breakfast',12,7,'Gentle forest hike along historic trail.');
INSERT INTO ItineraryDays VALUES(111,17,6,'Grindelwald First Cliff Walk & Adventure Activities','Gondola to Grindelwald First. Walk the thrilling metal suspended First Cliff Walk by Tissot, optional First Glider or mountain cart descents.','Breakfast & Dinner',12,7,'Adrenaline activities available on site.');
INSERT INTO ItineraryDays VALUES(112,17,7,'Swiss Chocolatier Experience & Departure','Visit Funky Chocolate Club in Interlaken for artisan Swiss chocolate tasting. Return rail transfer to Zurich Airport.','Breakfast',12,7,'Board flight with alpine memories.');
INSERT INTO ItineraryDays VALUES(113,18,1,'Arrival in Denpasar & Ubud Rainforest Check-in','Welcome at Ngurah Rai International Airport with traditional frangipani flower garland. Private transfer to luxury pool villa in Ubud valley.','Dinner',13,8,'Balinese herbal welcome beverage.');
INSERT INTO ItineraryDays VALUES(114,18,2,'Tegallalang Rice Terraces & Sacred Monkey Forest','Morning walk through UNESCO Tegallalang emerald green rice terraces with Bali swing experience. Afternoon visit to sacred Ubud Monkey Forest sanctuary and royal palace.','Breakfast',13,8,'Comfortable walking shoes recommended.');
INSERT INTO ItineraryDays VALUES(115,18,3,'Tegenungan Waterfall Trek & Goa Gajah Cave','Scenic hike down to rushing Tegenungan waterfall with natural freshwater pools. Explore 9th-century Elephant Cave (Goa Gajah) temple.','Breakfast',13,8,'Swimwear recommended for waterfall splash.');
INSERT INTO ItineraryDays VALUES(116,18,4,'Uluwatu Sunset Temple & Jimbaran Bay Seafood BBQ','Transfer to southern peninsula. Visit cliffside Uluwatu Temple perched 70 meters above crashing waves, watch fiery Kecak fire dance, and savor beachside candlelit seafood dinner on Jimbaran sands.','Breakfast & Dinner',13,8,'Watch for ocean sunsets and wild monkeys.');
INSERT INTO ItineraryDays VALUES(117,18,5,'Tanah Lot Temple & Airport Departure','Visit iconic sea temple Tanah Lot sitting on an offshore rock formation. Souvenir shopping at local art markets and transfer to airport.','Breakfast',13,8,'Airport transfer timed with flight schedule.');
INSERT INTO ItineraryDays VALUES(118,19,1,'Tokyo Arrival & Shinjuku Neon Night Walk','Arrival at Tokyo Haneda/Narita Airport, private coach transfer to hotel. Evening orientation walk through vibrant Shinjuku, Omoide Yokocho laneways, and Godzilla road.','Dinner',14,9,'Welcome Japanese ramen / izakaya dining.');
INSERT INTO ItineraryDays VALUES(119,19,2,'Historic Asakusa Senso-ji & Shibuya Crossing','Visit Tokyo''s oldest temple Senso-ji in Asakusa. Walk through Nakamise market street. Afternoon experience at bustling Shibuya Crossing and Meiji Shinto Shrine in Harajuku forest.','Breakfast',14,9,'Photo stop at legendary Hachiko dog statue.');
INSERT INTO ItineraryDays VALUES(120,19,3,'Mount Fuji 5th Station & Lake Kawaguchiko Cruise','Full-day scenic excursion to Mount Fuji 5th Station (2,300m). Enjoy a relaxing cruise on Lake Kawaguchiko reflecting snow-capped Fuji and ride the Mt. Fuji Panoramic Ropeway.','Breakfast & Lunch',14,9,'Breathtaking views on clear days.');
INSERT INTO ItineraryDays VALUES(121,19,4,'Shinkansen Bullet Train to Kyoto & Fushimi Inari','Board the high-speed Shinkansen Nozomi bullet train (reach 285 km/h) to Kyoto. Walk through the iconic tunnel of 10,000 vermilion torii gates at Fushimi Inari shrine.','Breakfast',14,9,'Baggage forwarded directly to Kyoto hotel.');
INSERT INTO ItineraryDays VALUES(122,19,5,'Kinkaku-ji Golden Pavilion & Arashiyama Bamboo Grove','Marvel at the Zen temple of Kinkaku-ji covered in gold leaf reflecting on Kyoko-chi pond. Stroll through the towering stalks of Arashiyama Bamboo Grove and visit Tenryu-ji gardens.','Breakfast',14,9,'Rickshaw rides available in Arashiyama.');
INSERT INTO ItineraryDays VALUES(123,19,6,'Gion Geisha Quarter Walk & Traditional Tea Ceremony','Participate in an authentic Zen tea ceremony in a historic machiya townhouse. Evening guided walking tour through lantern-lit preservation streets of Gion geisha quarter.','Breakfast & Dinner',14,9,'Traditional kaiseki multi-course dinner.');
INSERT INTO ItineraryDays VALUES(124,19,7,'Nishiki Market Culinary Tour & Kansai Departure','Explore Nishiki Market known as ''Kyoto''s Kitchen'', sampling matcha treats, dashi tamago, and wagashi sweets. Transfer to Kansai International Airport.','Breakfast',14,9,'Direct airport express train transfer.');
INSERT INTO ItineraryDays VALUES(125,20,1,'Arrival in Dubai & Marina Luxury Check-in','VIP airport greeting at Dubai International Airport with private chauffeur transfer to 5-star hotel in Dubai Marina. Evening leisure walk along Marina promenade.','Dinner',15,10,'Arabic dates and coffee upon arrival.');
INSERT INTO ItineraryDays VALUES(126,20,2,'Burj Khalifa 124th Floor & Dubai Mall Fountains','High-speed elevator to ''At The Top'' observation deck on Burj Khalifa 124th & 125th floors. Afternoon luxury shopping at Dubai Mall and evening choreographed fountain show.','Breakfast',15,10,'Fast-track entry tickets included.');
INSERT INTO ItineraryDays VALUES(127,20,3,'Red Dune 4x4 Desert Safari & Bedouin BBQ Camp','Thrilling 4x4 dune bashing across golden Lahbab red dunes. Sandboarding, sunset photo stops, camel riding, henna painting, belly dance show, and five-star BBQ banquet under desert stars.','Breakfast & Dinner',15,10,'Desert safari vehicle fully air-conditioned.');
INSERT INTO ItineraryDays VALUES(128,20,4,'Private Yacht Marina Cruise & Gold Souk Heritage','Morning 2-hour private luxury yacht cruise around Palm Jumeirah, Atlantis The Palm, and Burj Al Arab. Afternoon Abra boat crossing over Dubai Creek to explore Gold and Spice Souks.','Breakfast',15,10,'Complimentary refreshments aboard yacht.');
INSERT INTO ItineraryDays VALUES(129,20,5,'Museum of the Future Photo Stop & Departure','Visit the architectural marvel Museum of the Future for exterior photo stops and Souk Madinat Jumeirah. Private chauffeur transfer to Dubai Airport.','Breakfast',15,10,'Late checkout arranged upon availability.');
INSERT INTO ItineraryDays VALUES(130,21,1,'Speedboat Arrival & Overwater Villa Check-in','Arrive at Velana International Airport in Malé. Scenic 35-minute luxury speedboat transfer across turquoise atoll waters. Check-in to private overwater sunrise villa with direct lagoon stairs.','Lunch & Dinner',16,11,'Welcome coconut drink and tropical fruit basket.');
INSERT INTO ItineraryDays VALUES(131,21,2,'House Reef Snorkeling Safari & Dolphin Sunset Cruise','Morning guided snorkeling excursion along house reef vibrant coral gardens witnessing sea turtles, rays, and clownfish. Late afternoon catamaran cruise spotting wild spinner dolphins.','All Inclusive',16,11,'High-definition underwater photography included.');
INSERT INTO ItineraryDays VALUES(132,21,3,'Lagoon Water Sports & Private Beach Candlelight Dinner','Complimentary stand-up paddleboarding and clear-bottom kayaking in calm lagoon waters. Indulge in sunset cocktails and an intimate four-course dinner served barefoot on the sandbank.','All Inclusive',16,11,'Private table with tiki torches on beach.');
INSERT INTO ItineraryDays VALUES(133,21,4,'Floating Breakfast & Homeward Speedboat Transfer','Enjoy signature floating tropical breakfast in private plunge pool overlooking the Indian Ocean. Speedboat transfer to Malé airport for flight connection.','Breakfast',16,11,'Departure farewell with shell necklace.');
INSERT INTO ItineraryDays VALUES(134,22,1,'Arrival at JFK & Times Square Lights','Arrive at JFK/Newark Airport, private luxury transfer to Manhattan hotel near Grand Central. Evening walk into dazzling neon lights of Times Square and Broadway theatre district.','Dinner',17,12,'Classic New York style dinner.');
INSERT INTO ItineraryDays VALUES(135,22,2,'Statue of Liberty, Ellis Island & Financial District','Ferry cruise to Liberty Island for close-up views of Statue of Liberty and historic Ellis Island immigration museum. Afternoon walk past Wall Street Charging Bull and 9/11 Memorial reflection pools.','Breakfast',17,12,'Reserved pedestal access tickets.');
INSERT INTO ItineraryDays VALUES(136,22,3,'Central Park Walking Tour & Metropolitan Museum (The Met)','Morning stroll through iconic Central Park spots: Bow Bridge, Bethesda Terrace, and Strawberry Fields. Afternoon exploring Egyptian temples, European masters, and rooftop views at The Met.','Breakfast',17,12,'Museum admission with audio guide included.');
INSERT INTO ItineraryDays VALUES(137,22,4,'Summit One Vanderbilt & 5th Avenue Shopping','Ascend 1,000 feet to Summit One Vanderbilt for immersive mirror art rooms and skyline views of the Empire State Building and Chrysler Building. Stroll down world-famous Fifth Avenue.','Breakfast',17,12,'Glass-bottom elevator sky experience.');
INSERT INTO ItineraryDays VALUES(138,22,5,'High Line Elevated Park, Chelsea Market & Broadway Show','Walk the landscaped High Line historic elevated rail park to Hudson Yards ''Vessel''. Lunch at gourmet Chelsea Market. Evening attendance at a world-class Broadway Musical performance.','Breakfast',17,12,'Premium orchestra/front mezzanine seating.');
INSERT INTO ItineraryDays VALUES(139,22,6,'Brooklyn Bridge Walk, DUMBO Skyline & Departure','Walk across the historic Brooklyn Bridge for morning skyline views. Photo shoot in DUMBO waterfront park overlooking Manhattan Bridge. Transfer to JFK Airport for flight home.','Breakfast',17,12,'Private departure chauffeur transfer.');
INSERT INTO ItineraryDays VALUES(140,23,1,'Arrival in Sydney & Circular Quay Sunset Walk','Welcome at Sydney Kingsford Smith Airport with private transfer to harbour hotel. Stroll along Circular Quay and historic cobblestone lanes of The Rocks.','Dinner',18,13,'Harbour view dining with modern Australian cuisine.');
INSERT INTO ItineraryDays VALUES(141,23,2,'Sydney Opera House Tour & Royal Botanic Garden','Expert guided architectural tour inside the world-famous sails of the Sydney Opera House. Scenic walk through lush Royal Botanic Garden to Mrs Macquarie''s Chair viewpoint.','Breakfast',18,13,'Exclusive access to Opera House performance halls.');
INSERT INTO ItineraryDays VALUES(142,23,3,'Sydney Harbour Bridge Pylon & Sunset Catamaran Cruise','Climb 200 steps to South-East Pylon lookout for bridge history and harbour views. Evening 2-hour sunset catamaran cruise across Sydney Harbour with Australian wines and canapés.','Breakfast & Dinner',18,13,'Panoramic sunset view passing beneath Bridge.');
INSERT INTO ItineraryDays VALUES(143,23,4,'Bondi Beach Coastal Walk to Bronte & Surfing Lesson','Morning scenic cliffside walk from Bondi Beach to Tamarama and Bronte. Optional beginner surfing lesson with certified instructor on golden Bondi sands.','Breakfast',18,13,'Swim in iconic Bondi Icebergs ocean pool.');
INSERT INTO ItineraryDays VALUES(144,23,5,'Blue Mountains World Heritage Day Tour','Full-day excursion to Blue Mountains National Park: ride Scenic Railway, Skyway cable car over Jamison Valley, and view Three Sisters rock formation at Echo Point.','Breakfast & Lunch',18,13,'Encounter wild kangaroos and eucalyptus forests.');
INSERT INTO ItineraryDays VALUES(145,23,6,'Darling Harbour, Shopping & Airport Departure','Morning visit to Darling Harbour and Queen Victoria Building historic shopping arcade. Private coach transfer to Sydney Airport.','Breakfast',18,13,'GST tourist refund assistance at airport.');
INSERT INTO ItineraryDays VALUES(146,24,1,'Arrival in Cape Town & V&A Waterfront','Arrival at Cape Town International Airport, private scenic transfer to hotel. Evening walk along bustling Victoria & Alfred Waterfront against Table Mountain silhouette.','Dinner',19,14,'Welcome dinner featuring Cape Malay delicacies.');
INSERT INTO ItineraryDays VALUES(147,24,2,'Table Mountain Aerial Cableway Summit Exploration','Ride revolving cable car up to Table Mountain flat plateau (1,085m). Guided nature walk along fynbos flora trails with 360-degree views of the Atlantic Ocean and City Bowl.','Breakfast',19,14,'Weather dependent; alternative Signal Hill provided.');
INSERT INTO ItineraryDays VALUES(148,24,3,'Scenic Chapman''s Peak Drive & Hout Bay Seal Island','Spectacular coastal drive along carved cliffs of Chapman''s Peak Drive. Boat excursion from Hout Bay to Seal Island to see thousands of wild Cape fur seals.','Breakfast',19,14,'One of world''s most dramatic marine drives.');
INSERT INTO ItineraryDays VALUES(149,24,4,'Boulders Beach Penguins & Cape Point Landmark','Visit Boulders Beach boardwalk to observe endangered African penguin colony up close. Continue to Cape of Good Hope nature reserve and Flying Dutchman funicular to Cape Point lighthouse.','Breakfast & Lunch',19,14,'Funicular ticket included.');
INSERT INTO ItineraryDays VALUES(150,24,5,'Kirstenbosch Botanical Gardens & Stellenbosch Winelands','Walk the treetop canopy walkway (Boomslang) at Kirstenbosch National Botanical Garden. Afternoon journey to historic Stellenbosch winelands for grape juice and gourmet cheese tasting.','Breakfast',19,14,'World heritage botanical biodiversity.');
INSERT INTO ItineraryDays VALUES(151,24,6,'Bo-Kaap Colorful Quarter & Airport Departure','Morning photo walk through pastel-colored houses of Bo-Kaap historic Cape Malay district. Transfer to Cape Town International Airport for departure flight.','Breakfast',19,14,'Safe travel departure transfer.');
INSERT INTO ItineraryDays VALUES(152,25,1,'Arrival in Rio de Janeiro & Copacabana Check-in','Welcome at Galeão International Airport with private transfer to beachfront Copacabana hotel. Relax on world-famous black-and-white wave promenade with chilled fresh coconut water.','Dinner',20,15,'Traditional Brazilian barbecue welcome churrascaria.');
INSERT INTO ItineraryDays VALUES(153,25,2,'Christ the Redeemer & Corcovado Mountain Cog Railway','Board the historic electric cog railway through lush Tijuca Atlantic rainforest up to Corcovado peak (710m). Stand beneath colossal 30-meter Christ the Redeemer statue.','Breakfast',20,15,'Fast-track train tickets included.');
INSERT INTO ItineraryDays VALUES(154,25,3,'Sugarloaf Mountain Cableway & Sunset Over Guanabara Bay','Ascend two-stage aerial cableway to Urca Hill and Sugarloaf Mountain (Pão de Açúcar, 396m). Watch golden Brazilian sunset across Rio''s beaches and coastal peaks.','Breakfast',20,15,'Spectacular twilight views over Guanabara Bay.');
INSERT INTO ItineraryDays VALUES(155,25,4,'Tijuca Rainforest Open Jeep Safari & Ipanema Beach','Open-top 4x4 Jeep tour through the world''s largest urban rainforest: Tijuca National Park. Visit Taunay Waterfall and Chinese Belvedere. Afternoon swimming at fashionable Ipanema beach Posto 9.','Breakfast',20,15,'Spot monkeys and tropical toucans.');
INSERT INTO ItineraryDays VALUES(156,25,5,'Santa Teresa Bohemian Quarter, Selarón Steps & Lapa Samba','Ride historic yellow tram into bohemian Santa Teresa. Walk down Jorge Selarón''s vibrant 215 ceramic tile steps. Evening authentic live samba music at historic Lapa venue.','Breakfast & Dinner',20,15,'Authentic Rio nightlife cultural experience.');
INSERT INTO ItineraryDays VALUES(157,25,6,'Maracanã Stadium & Rio Departure','External photo stop at legendary Maracanã Stadium and Metropolitan Cathedral. Private transfer to Galeão Airport for international flight.','Breakfast',20,15,'Airport transfer included.');
INSERT INTO ItineraryDays VALUES(158,26,1,'Arrival in Srinagar & Dal Lake Shikara','Arrive at Srinagar Sheikh ul-Alam Airport. Check-in to handcrafted cedarwood luxury houseboat. Evening private Shikara ride across Dal Lake and floating flower gardens.','Dinner',1,1,NULL);
INSERT INTO ItineraryDays VALUES(159,26,2,'Mughal Gardens & Old Srinagar Heritage','Visit Shalimar Bagh, Nishat Bagh, and Chashme Shahi. Walk through historic Old City spice and pashmina bazaars.','Breakfast & Dinner',1,1,NULL);
INSERT INTO ItineraryDays VALUES(160,26,3,'Meadow of Flowers: Gulmarg Excursion','Scenic drive to Gulmarg. Ascend on the world-famous Gulmarg Gondola Phase 1 to Kongdoori mountain ridge with snow views.','Breakfast & Dinner',1,1,NULL);
INSERT INTO ItineraryDays VALUES(161,26,4,'Valley of Shepherds: Pahalgam Day Trip','Journey through saffron fields of Pampore to Pahalgam along Lidder River. Visit scenic Betaab Valley and Aru Valley.','Breakfast & Dinner',1,1,NULL);
INSERT INTO ItineraryDays VALUES(162,26,5,'Romantic Pine Strolls & Kashmiri Wazwan Dinner','Relaxed morning stroll around Shankaracharya Temple viewpoint. Evening special 7-course Kashmiri Wazwan candlelight dinner.','Breakfast & Dinner',1,1,NULL);
INSERT INTO ItineraryDays VALUES(163,26,6,'Souvenir Shopping & Srinagar Departure','Morning breakfast on the houseboat deck. Souvenir shopping for walnut wood craft and dry fruits. Chauffeur drop to airport.','Breakfast',1,1,NULL);
INSERT INTO ItineraryDays VALUES(164,30,1,'Arrival & Calangute Beach Sunset','Arrive at Goa Airport / Thivim Station. Private transfer to 3-Star beach resort near Calangute. Sunset leisure walk on the beach.','None',2,5,NULL);
INSERT INTO ItineraryDays VALUES(165,30,2,'North Goa Forts & Shacks Tour','Explore 17th-century Fort Aguada overlooking Arabian Sea, followed by Baga beach and Anjuna flea market shacks.','Breakfast',2,5,NULL);
INSERT INTO ItineraryDays VALUES(166,30,3,'Old Goa Heritage & Mandovi Sunset Cruise','Tour UNESCO World Heritage churches Basilica of Bom Jesus and Se Cathedral. Evening Mandovi river music and folk dance cruise.','Breakfast',2,5,NULL);
INSERT INTO ItineraryDays VALUES(167,30,4,'Goan Spice Souvenirs & Airport Drop','Leisure morning swim. Pick up cashew nuts and feni from Panaji market. Transfer to airport for return journey.','Breakfast',2,5,NULL);
INSERT INTO ItineraryDays VALUES(168,31,1,'Arrival in Bangkok & River Chao Phraya','Land at Suvarnabhumi Airport. Transfer to 4-Star Bangkok hotel. Evening Chao Phraya River dinner cruise with panoramic temple views.','Dinner',11,6,NULL);
INSERT INTO ItineraryDays VALUES(169,31,2,'Grand Palace & Wat Pho Temple Discovery','Guided tour of Bangkok Grand Palace, Emerald Buddha, and Reclining Buddha at Wat Pho. Evening Asiatique night market.','Breakfast',11,6,NULL);
INSERT INTO ItineraryDays VALUES(170,31,3,'Flight to Phuket & Patong Beach Sunset','Morning flight to Phuket island. Check-in to tropical resort. Leisure afternoon relaxing on Patong and Kata beaches.','Breakfast',12,6,NULL);
INSERT INTO ItineraryDays VALUES(171,31,4,'Phi Phi Islands Speedboat & Maya Bay','Full-day catamaran speedboat excursion to Phi Phi Don, Phi Phi Leh, Maya Bay, and snorkeling in crystal emerald lagoons.','Breakfast & Lunch',12,10,NULL);
INSERT INTO ItineraryDays VALUES(172,31,5,'Phuket Old Town & Big Buddha Viewpoint','Visit Sino-Portuguese heritage architecture in Phuket Old Town, followed by Big Buddha hilltop offering 360-degree island vistas.','Breakfast',12,6,NULL);
INSERT INTO ItineraryDays VALUES(173,31,6,'Phuket Departure to Home','Free morning for beachfront massage and duty-free shopping. Chauffeur transfer to Phuket International Airport.','Breakfast',12,6,NULL);
INSERT INTO ItineraryDays VALUES(174,32,1,'Arrival & Marina Bay Sands Light Show','Arrive at award-winning Changi Jewel Airport. Transfer to Orchard hotel. Evening Spectra Light & Water show at Marina Bay.','None',14,6,NULL);
INSERT INTO ItineraryDays VALUES(175,32,2,'Gardens by the Bay & Supertree Observatory','Explore futuristic Cloud Forest dome with indoor waterfall, Flower Dome, and canopy walk along Supertrees.','Breakfast',14,6,NULL);
INSERT INTO ItineraryDays VALUES(176,32,3,'Full Day Universal Studios Singapore','Thrilling full day at Universal Studios on Sentosa Island: Battlestar Galactica, Transformers 3D, and Jurassic Park rapids.','Breakfast',14,6,NULL);
INSERT INTO ItineraryDays VALUES(177,32,4,'Sentosa Cable Car, S.E.A. Aquarium & Night Safari','Scenic cable car across Singapore harbour, explore S.E.A. Aquarium, and evening open-tram Night Safari in lush rainforest.','Breakfast',14,6,NULL);
INSERT INTO ItineraryDays VALUES(178,32,5,'Changi Jewel Vortex & Departure','Morning souvenir shopping. Experience Jewel Changi indoor Rain Vortex waterfall before boarding home flight.','Breakfast',14,6,NULL);
CREATE TABLE PackageHotels (
    package_id INTEGER NOT NULL,
    hotel_id INTEGER NOT NULL,
    room_type TEXT DEFAULT 'Deluxe Double Room',
    PRIMARY KEY (package_id, hotel_id),
    FOREIGN KEY (package_id) REFERENCES TourPackages(package_id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES Hotels(hotel_id) ON DELETE CASCADE
);
INSERT INTO PackageHotels VALUES(16,11,'Deluxe Suite with Breakfast');
INSERT INTO PackageHotels VALUES(17,12,'Deluxe Suite with Breakfast');
INSERT INTO PackageHotels VALUES(18,13,'Deluxe Suite with Breakfast');
INSERT INTO PackageHotels VALUES(19,14,'Deluxe Suite with Breakfast');
INSERT INTO PackageHotels VALUES(20,15,'Deluxe Suite with Breakfast');
INSERT INTO PackageHotels VALUES(21,16,'Deluxe Suite with Breakfast');
INSERT INTO PackageHotels VALUES(22,17,'Deluxe Suite with Breakfast');
INSERT INTO PackageHotels VALUES(23,18,'Deluxe Suite with Breakfast');
INSERT INTO PackageHotels VALUES(24,19,'Deluxe Suite with Breakfast');
INSERT INTO PackageHotels VALUES(25,20,'Deluxe Suite with Breakfast');
CREATE TABLE GuideAssignments (
    assignment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    guide_id INTEGER NOT NULL,
    departure_id INTEGER NOT NULL,
    assigned_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT CHECK(status IN ('Assigned', 'Confirmed', 'Completed', 'Cancelled')) DEFAULT 'Assigned',
    UNIQUE(guide_id, departure_id),
    FOREIGN KEY (guide_id) REFERENCES Guides(guide_id) ON DELETE CASCADE,
    FOREIGN KEY (departure_id) REFERENCES Departures(departure_id) ON DELETE CASCADE
);
INSERT INTO GuideAssignments VALUES(1,1,1,'2026-10-11 16:06:12','Confirmed');
INSERT INTO GuideAssignments VALUES(2,1,2,'2026-10-11 16:06:12','Assigned');
INSERT INTO GuideAssignments VALUES(3,2,3,'2026-10-11 16:06:12','Confirmed');
INSERT INTO GuideAssignments VALUES(4,2,5,'2026-10-11 16:06:12','Confirmed');
INSERT INTO GuideAssignments VALUES(5,3,6,'2026-10-11 16:06:12','Confirmed');
INSERT INTO GuideAssignments VALUES(6,3,8,'2026-10-11 16:06:12','Confirmed');
INSERT INTO GuideAssignments VALUES(7,4,11,'2026-10-11 16:57:40','Confirmed');
INSERT INTO GuideAssignments VALUES(8,4,12,'2026-10-11 16:57:40','Assigned');
INSERT INTO GuideAssignments VALUES(9,6,15,'2026-10-11 16:57:40','Confirmed');
INSERT INTO GuideAssignments VALUES(10,5,17,'2026-10-11 16:57:40','Confirmed');
INSERT INTO GuideAssignments VALUES(11,7,19,'2026-10-11 16:57:40','Confirmed');
INSERT INTO GuideAssignments VALUES(12,7,21,'2026-10-11 16:57:40','Confirmed');
INSERT INTO GuideAssignments VALUES(13,8,23,'2026-10-11 16:57:40','Confirmed');
INSERT INTO GuideAssignments VALUES(14,8,24,'2026-10-11 16:57:40','Confirmed');
CREATE TABLE Bookings (
    booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_reference TEXT NOT NULL UNIQUE,
    customer_id INTEGER NOT NULL,
    departure_id INTEGER NOT NULL,
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    traveller_count INTEGER NOT NULL CHECK(traveller_count > 0),
    total_amount REAL NOT NULL,
    discount_amount REAL NOT NULL DEFAULT 0.00,
    tax_amount REAL NOT NULL DEFAULT 0.00,
    net_amount REAL NOT NULL CHECK(net_amount >= 0),
    booking_status TEXT NOT NULL CHECK(booking_status IN ('Pending', 'Confirmed', 'Cancelled', 'Completed')) DEFAULT 'Confirmed',
    special_requests TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE RESTRICT,
    FOREIGN KEY (departure_id) REFERENCES Departures(departure_id) ON DELETE RESTRICT
);
INSERT INTO Bookings VALUES(1,'BY-2026-KASH-101',1,1,'2026-10-01 11:20:00',2,57998.0,2000.0,2799.9,58797.9,'Confirmed','Vegetarian meals preferred on houseboat','2026-10-11 16:06:12');
INSERT INTO Bookings VALUES(2,'BY-2026-GOA-202',2,3,'2026-10-03 14:15:00',4,73996.0,3000.0,3549.8,74545.8,'Confirmed','Need interconnecting resort rooms','2026-10-11 16:06:12');
INSERT INTO Bookings VALUES(3,'BY-2026-KERA-303',3,5,'2026-10-05 09:40:00',2,49000.0,1500.0,2375.0,49875.0,'Confirmed','Celebrating 5th wedding anniversary','2026-10-11 16:06:12');
INSERT INTO Bookings VALUES(4,'BY-2026-RAJ-404',4,6,'2026-10-06 16:30:00',3,96000.0,4000.0,4600.0,96600.0,'Cancelled','Elderly parents travelling, ground floor required','2026-10-11 16:06:12');
INSERT INTO Bookings VALUES(5,'BY-2026-KASH-505',1,2,'2026-10-08 18:00:00',2,57998.0,2000.0,2799.9,58797.9,'Confirmed','Require airport pickup with child car seat','2026-10-11 16:06:12');
INSERT INTO Bookings VALUES(6,'BY-2026-HONE-97742F',1,2,'2026-10-11 16:17:57.922422',2,57998.0,2500.0,2774.9,58272.9,'Cancelled',NULL,'2026-10-11 16:17:57.922988');
INSERT INTO Bookings VALUES(7,'BY-2026-HONE-196B34',1,2,'2026-10-11 16:48:38.535395',2,57998.0,2500.0,2774.9,58272.9,'Cancelled',NULL,'2026-10-11 16:48:38.535897');
INSERT INTO Bookings VALUES(8,'BY-2026-PARIS-701',1,11,'2026-10-09 10:30:00',2,150000.0,5000.0,7250.0,152250.0,'Confirmed','French speaking guide requested','2026-10-11 16:57:40');
INSERT INTO Bookings VALUES(9,'BY-2026-BALI-802',2,15,'2026-10-10 14:20:00',2,90000.0,3000.0,4350.0,91350.0,'Confirmed','Honeymoon private pool setup','2026-10-11 16:57:40');
INSERT INTO Bookings VALUES(10,'BY-2026-SWISS-903',3,13,'2026-10-11 11:15:00',2,300000.0,10000.0,14500.0,304500.0,'Confirmed','Vegetarian meals on mountain railways','2026-10-11 16:57:40');
INSERT INTO Bookings VALUES(11,'BY-2026-HONE-1AEF73',1,2,'2026-10-11 16:58:24.361042',2,57998.0,2500.0,2774.9,58272.9,'Cancelled',NULL,'2026-10-11 16:58:24.361993');
INSERT INTO Bookings VALUES(12,'BY-2026-HONE-344CEA',1,2,'2026-10-11 17:05:03.273570',2,57998.0,2500.0,2774.9,58272.9,'Cancelled',NULL,'2026-10-11 17:05:03.274499');
INSERT INTO Bookings VALUES(13,'BY-2026-HONE-B64FEE',1,2,'2026-10-11 17:05:47.605694',2,57998.0,2500.0,2774.9,58272.9,'Cancelled',NULL,'2026-10-11 17:05:47.606217');
INSERT INTO Bookings VALUES(14,'BY-2026-HONE-9699C1',1,2,'2026-10-11 17:08:49.359833',2,57998.0,2500.0,2774.9,58272.9,'Cancelled',NULL,'2026-10-11 17:08:49.360339');
INSERT INTO Bookings VALUES(15,'BY-2026-HONE-A167F0',1,2,'2026-10-11 17:27:07.318189',2,57998.0,2500.0,2774.9,58272.9,'Cancelled',NULL,'2026-10-11 17:27:07.318703');
CREATE TABLE Travellers (
    traveller_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    full_name TEXT NOT NULL,
    age INTEGER NOT NULL CHECK(age >= 0 AND age <= 120),
    gender TEXT NOT NULL CHECK(gender IN ('Male', 'Female', 'Other')),
    id_proof_type TEXT CHECK(id_proof_type IN ('Aadhaar', 'Passport', 'Voter ID', 'Driving License')) DEFAULT 'Aadhaar',
    id_proof_number TEXT,
    phone TEXT,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE CASCADE
);
INSERT INTO Travellers VALUES(1,1,'Arjun Sharma',32,'Male','Aadhaar','1234-5678-9012','+91 98765 43210');
INSERT INTO Travellers VALUES(2,1,'Kavita Sharma',29,'Female','Aadhaar','9876-5432-1098','+91 98765 43211');
INSERT INTO Travellers VALUES(3,2,'Priya Nair',35,'Female','Passport','Z1234567','+91 98234 56789');
INSERT INTO Travellers VALUES(4,2,'Deepak Nair',38,'Male','Passport','Z7654321','+91 98234 56781');
INSERT INTO Travellers VALUES(5,2,'Aarav Nair',9,'Male','Aadhaar','4567-8901-2345',NULL);
INSERT INTO Travellers VALUES(6,2,'Meera Nair',6,'Female','Aadhaar','6789-0123-4567',NULL);
INSERT INTO Travellers VALUES(7,3,'Rohit Verma',28,'Male','Aadhaar','3344-5566-7788','+91 97123 45678');
INSERT INTO Travellers VALUES(8,3,'Pooja Verma',27,'Female','Aadhaar','8877-6655-4433','+91 97123 45672');
INSERT INTO Travellers VALUES(9,4,'Sneha Patel',45,'Female','Aadhaar','1122-3344-5566','+91 99887 76655');
INSERT INTO Travellers VALUES(10,4,'Kantilal Patel',72,'Male','Aadhaar','5566-7788-9900','+91 99887 76651');
INSERT INTO Travellers VALUES(11,4,'Jasuben Patel',68,'Female','Aadhaar','9900-1122-3344','+91 99887 76652');
INSERT INTO Travellers VALUES(12,1,'Test Passenger 1',30,'Female','Aadhaar',NULL,NULL);
INSERT INTO Travellers VALUES(13,1,'Test Passenger 2',32,'Male','Aadhaar',NULL,NULL);
INSERT INTO Travellers VALUES(14,1,'Test Passenger 1',30,'Female','Aadhaar',NULL,NULL);
INSERT INTO Travellers VALUES(15,1,'Test Passenger 2',32,'Male','Aadhaar',NULL,NULL);
INSERT INTO Travellers VALUES(16,1,'Test Passenger 1',30,'Female','Aadhaar',NULL,NULL);
INSERT INTO Travellers VALUES(17,1,'Test Passenger 2',32,'Male','Aadhaar',NULL,NULL);
INSERT INTO Travellers VALUES(18,1,'Test Passenger 1',30,'Female','Aadhaar',NULL,NULL);
INSERT INTO Travellers VALUES(19,1,'Test Passenger 2',32,'Male','Aadhaar',NULL,NULL);
INSERT INTO Travellers VALUES(20,1,'Test Passenger 1',30,'Female','Aadhaar',NULL,NULL);
INSERT INTO Travellers VALUES(21,1,'Test Passenger 2',32,'Male','Aadhaar',NULL,NULL);
INSERT INTO Travellers VALUES(22,1,'Test Passenger 1',30,'Female','Aadhaar',NULL,NULL);
INSERT INTO Travellers VALUES(23,1,'Test Passenger 2',32,'Male','Aadhaar',NULL,NULL);
INSERT INTO Travellers VALUES(24,1,'Test Passenger 1',30,'Female','Aadhaar',NULL,NULL);
INSERT INTO Travellers VALUES(25,1,'Test Passenger 2',32,'Male','Aadhaar',NULL,NULL);
CREATE TABLE BookingTravellers (
    booking_id INTEGER NOT NULL,
    traveller_id INTEGER NOT NULL,
    seat_number TEXT,
    PRIMARY KEY (booking_id, traveller_id),
    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (traveller_id) REFERENCES Travellers(traveller_id) ON DELETE CASCADE
);
INSERT INTO BookingTravellers VALUES(1,1,'S-1A');
INSERT INTO BookingTravellers VALUES(1,2,'S-1B');
INSERT INTO BookingTravellers VALUES(2,3,'G-2A');
INSERT INTO BookingTravellers VALUES(2,4,'G-2B');
INSERT INTO BookingTravellers VALUES(2,5,'G-2C');
INSERT INTO BookingTravellers VALUES(2,6,'G-2D');
INSERT INTO BookingTravellers VALUES(3,7,'K-3A');
INSERT INTO BookingTravellers VALUES(3,8,'K-3B');
INSERT INTO BookingTravellers VALUES(4,9,'R-4A');
INSERT INTO BookingTravellers VALUES(4,10,'R-4B');
INSERT INTO BookingTravellers VALUES(4,11,'R-4C');
INSERT INTO BookingTravellers VALUES(5,1,'S-5A');
INSERT INTO BookingTravellers VALUES(5,2,'S-5B');
INSERT INTO BookingTravellers VALUES(6,12,'T-1');
INSERT INTO BookingTravellers VALUES(6,13,'T-2');
INSERT INTO BookingTravellers VALUES(7,14,'T-1');
INSERT INTO BookingTravellers VALUES(7,15,'T-2');
INSERT INTO BookingTravellers VALUES(8,1,'P-1A');
INSERT INTO BookingTravellers VALUES(8,2,'P-1B');
INSERT INTO BookingTravellers VALUES(9,3,'B-2A');
INSERT INTO BookingTravellers VALUES(9,4,'B-2B');
INSERT INTO BookingTravellers VALUES(10,7,'S-3A');
INSERT INTO BookingTravellers VALUES(10,8,'S-3B');
INSERT INTO BookingTravellers VALUES(11,16,'T-1');
INSERT INTO BookingTravellers VALUES(11,17,'T-2');
INSERT INTO BookingTravellers VALUES(12,18,'T-1');
INSERT INTO BookingTravellers VALUES(12,19,'T-2');
INSERT INTO BookingTravellers VALUES(13,20,'T-1');
INSERT INTO BookingTravellers VALUES(13,21,'T-2');
INSERT INTO BookingTravellers VALUES(14,22,'T-1');
INSERT INTO BookingTravellers VALUES(14,23,'T-2');
INSERT INTO BookingTravellers VALUES(15,24,'T-1');
INSERT INTO BookingTravellers VALUES(15,25,'T-2');
CREATE TABLE Payments (
    payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    payment_reference TEXT NOT NULL UNIQUE,
    payment_method TEXT NOT NULL CHECK(payment_method IN ('UPI', 'Card', 'NetBanking', 'DemoPay')),
    amount REAL NOT NULL CHECK(amount > 0),
    payment_status TEXT NOT NULL CHECK(payment_status IN ('Initiated', 'Successful', 'Failed', 'Refunded')) DEFAULT 'Successful',
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    gateway_response TEXT,
    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id) ON DELETE CASCADE
);
INSERT INTO Payments VALUES(1,1,'PAY-UPI-8841920','UPI',58797.9,'Successful','2026-10-01 11:22:15','{"status":"SUCCESS","upi_txn_id":"UPI992014","gateway":"BharatYatraDemoPG"}');
INSERT INTO Payments VALUES(2,2,'PAY-CARD-4410923','Card',74545.8,'Successful','2026-10-03 14:18:40','{"status":"SUCCESS","card_last4":"4242","gateway":"BharatYatraDemoPG"}');
INSERT INTO Payments VALUES(3,3,'PAY-NB-1093847','NetBanking',49875.0,'Successful','2026-10-05 09:43:00','{"status":"SUCCESS","bank":"HDFC","gateway":"BharatYatraDemoPG"}');
INSERT INTO Payments VALUES(4,4,'PAY-UPI-3329182','UPI',96600.0,'Refunded','2026-10-06 16:32:10','{"status":"SUCCESS","upi_txn_id":"UPI772810","gateway":"BharatYatraDemoPG"}');
INSERT INTO Payments VALUES(5,5,'PAY-DEMO-771239','DemoPay',58797.9,'Successful','2026-10-08 18:02:45','{"status":"SUCCESS","mode":"InstantDemo","gateway":"BharatYatraDemoPG"}');
INSERT INTO Payments VALUES(6,8,'PAY-UPI-PARIS-7711','UPI',152250.0,'Successful','2026-10-09 10:32:45','{"gateway":"BharatYatraGlobalPG","status":"SUCCESS"}');
INSERT INTO Payments VALUES(7,9,'PAY-CARD-BALI-8822','Card',91350.0,'Successful','2026-10-10 14:22:10','{"gateway":"BharatYatraGlobalPG","status":"SUCCESS","card_last4":"8811"}');
INSERT INTO Payments VALUES(8,10,'PAY-NB-SWISS-9933','NetBanking',304500.0,'Successful','2026-10-11 11:18:00','{"gateway":"BharatYatraGlobalPG","status":"SUCCESS","bank":"HDFC"}');
CREATE TABLE Cancellations (
    cancellation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL UNIQUE,
    cancellation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    reason TEXT NOT NULL,
    cancellation_fee REAL NOT NULL CHECK(cancellation_fee >= 0) DEFAULT 0.00,
    refundable_amount REAL NOT NULL CHECK(refundable_amount >= 0),
    status TEXT NOT NULL CHECK(status IN ('Pending', 'Approved', 'Rejected')) DEFAULT 'Approved',
    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id) ON DELETE CASCADE
);
INSERT INTO Cancellations VALUES(1,4,'2026-10-09 10:15:00','Sudden medical emergency for senior family traveller',9660.0,86940.0,'Approved');
INSERT INTO Cancellations VALUES(2,6,'2026-10-11 16:17:57.935671','Test automated cancellation flow',5827.29,52445.61,'Approved');
INSERT INTO Cancellations VALUES(3,7,'2026-10-11 16:48:38.545706','Test automated cancellation flow',5827.29,52445.61,'Approved');
INSERT INTO Cancellations VALUES(4,11,'2026-10-11 16:58:24.370873','Test automated cancellation flow',5827.29,52445.61,'Approved');
INSERT INTO Cancellations VALUES(5,12,'2026-10-11 17:05:03.282902','Test automated cancellation flow',5827.29,52445.61,'Approved');
INSERT INTO Cancellations VALUES(6,13,'2026-10-11 17:05:47.614982','Test automated cancellation flow',5827.29,52445.61,'Approved');
INSERT INTO Cancellations VALUES(7,14,'2026-10-11 17:08:49.368725','Test automated cancellation flow',5827.29,52445.61,'Approved');
INSERT INTO Cancellations VALUES(8,15,'2026-10-11 17:27:07.327868','Test automated cancellation flow',5827.29,52445.61,'Approved');
CREATE TABLE Refunds (
    refund_id INTEGER PRIMARY KEY AUTOINCREMENT,
    cancellation_id INTEGER NOT NULL,
    payment_id INTEGER NOT NULL,
    refund_amount REAL NOT NULL CHECK(refund_amount >= 0),
    refund_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    refund_method TEXT DEFAULT 'Original Source (UPI/Card)',
    refund_status TEXT NOT NULL CHECK(refund_status IN ('Pending', 'Approved', 'Processed', 'Rejected')) DEFAULT 'Processed',
    notes TEXT,
    FOREIGN KEY (cancellation_id) REFERENCES Cancellations(cancellation_id) ON DELETE CASCADE,
    FOREIGN KEY (payment_id) REFERENCES Payments(payment_id) ON DELETE CASCADE
);
INSERT INTO Refunds VALUES(1,1,4,86940.0,'2026-10-10 11:30:00','Original Source (UPI/Card)','Processed','Processed back to original UPI VPA. Cancellation fee of 10% deducted per policy.');
CREATE TABLE Countries (
        country_id INTEGER PRIMARY KEY AUTOINCREMENT,
        country_name TEXT NOT NULL UNIQUE,
        continent TEXT NOT NULL
    );
INSERT INTO Countries VALUES(1,'France','Europe');
INSERT INTO Countries VALUES(2,'Switzerland','Europe');
INSERT INTO Countries VALUES(3,'Indonesia','Asia');
INSERT INTO Countries VALUES(4,'Japan','Asia');
INSERT INTO Countries VALUES(5,'United Arab Emirates','Asia');
INSERT INTO Countries VALUES(6,'Maldives','Asia');
INSERT INTO Countries VALUES(7,'USA','North America');
INSERT INTO Countries VALUES(8,'Australia','Oceania');
INSERT INTO Countries VALUES(9,'South Africa','Africa');
INSERT INTO Countries VALUES(10,'Brazil','South America');
INSERT INTO Countries VALUES(11,'United Kingdom','Europe');
INSERT INTO Countries VALUES(12,'Italy','Europe');
INSERT INTO Countries VALUES(13,'Spain','Europe');
INSERT INTO Countries VALUES(14,'Greece','Europe');
INSERT INTO Countries VALUES(15,'Netherlands','Europe');
INSERT INTO Countries VALUES(16,'Türkiye','Europe / Asia');
INSERT INTO Countries VALUES(17,'Thailand','Asia');
INSERT INTO Countries VALUES(18,'Singapore','Asia');
INSERT INTO Countries VALUES(19,'Malaysia','Asia');
INSERT INTO Countries VALUES(20,'South Korea','Asia');
INSERT INTO Countries VALUES(21,'Nepal','Asia');
INSERT INTO Countries VALUES(22,'Sri Lanka','Asia');
INSERT INTO Countries VALUES(23,'India','Asia');
INSERT INTO Countries VALUES(24,'Qatar','Asia');
INSERT INTO Countries VALUES(25,'Canada','North America');
INSERT INTO Countries VALUES(26,'Mexico','North America');
INSERT INTO Countries VALUES(27,'Cuba','North America');
INSERT INTO Countries VALUES(28,'Peru','South America');
INSERT INTO Countries VALUES(29,'Argentina','South America');
INSERT INTO Countries VALUES(30,'Chile','South America');
INSERT INTO Countries VALUES(31,'New Zealand','Oceania');
INSERT INTO Countries VALUES(32,'Egypt','Africa');
INSERT INTO Countries VALUES(33,'Morocco','Africa');
INSERT INTO Countries VALUES(34,'Tanzania','Africa');
INSERT INTO Countries VALUES(35,'Kenya','Africa');
INSERT INTO Countries VALUES(36,'Iceland','Europe');
INSERT INTO Countries VALUES(37,'Czechia','Europe');
INSERT INTO Countries VALUES(38,'Austria','Europe');
INSERT INTO Countries VALUES(39,'Fiji','Oceania');
INSERT INTO Countries VALUES(40,'Jordan','Asia');
CREATE TABLE PackageCategories (
        category_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT
    );
INSERT INTO PackageCategories VALUES(1,'Adventure tourism','Trekking, hiking, rafting, climbing, and outdoor activities.');
INSERT INTO PackageCategories VALUES(2,'Beach holidays','Coastal resorts, island stays, swimming, and water activities.');
INSERT INTO PackageCategories VALUES(3,'Honeymoon packages','Couple-focused stays, scenic experiences, and private tours.');
INSERT INTO PackageCategories VALUES(4,'Family vacations','Family-friendly attractions, suitable hotels, and flexible itineraries.');
INSERT INTO PackageCategories VALUES(5,'Luxury tours','Premium accommodation, private transport, and curated experiences.');
INSERT INTO PackageCategories VALUES(6,'Cultural and heritage tours','Museums, monuments, historic cities, and local traditions.');
INSERT INTO PackageCategories VALUES(7,'Religious tourism','Pilgrimage destinations, sacred sites, and faith-related travel.');
INSERT INTO PackageCategories VALUES(8,'Wildlife safaris','National parks, guided wildlife viewing, and nature reserves.');
INSERT INTO PackageCategories VALUES(9,'Educational tours','Museums, science centres, universities, and learning visits.');
INSERT INTO PackageCategories VALUES(10,'Budget travel','Cost-conscious accommodation, group tours, and economical transport.');
INSERT INTO PackageCategories VALUES(11,'Cruise holidays','Sea voyages, cruise ports, and onboard activities.');
INSERT INTO PackageCategories VALUES(12,'Mountain and trekking tours','Mountain scenery, trails, and highland destinations.');
INSERT INTO PackageCategories VALUES(13,'Business travel','Work-related travel, conferences, and convenient accommodation.');
INSERT INTO PackageCategories VALUES(14,'Eco-tourism','Nature-focused visits that aim to reduce environmental impact.');
CREATE TABLE IF NOT EXISTS "TourPackages" (
            package_id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            category TEXT NOT NULL,
            duration_days INTEGER NOT NULL CHECK(duration_days > 0),
            duration_nights INTEGER NOT NULL CHECK(duration_nights >= 0),
            base_price REAL NOT NULL CHECK(base_price >= 0),
            featured_image TEXT,
            description TEXT NOT NULL,
            inclusions TEXT,
            exclusions TEXT,
            cancellation_policy TEXT,
            is_active INTEGER NOT NULL DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        , is_domestic INTEGER DEFAULT 1, hotel_star_rating INTEGER DEFAULT 4, flights_included INTEGER DEFAULT 0, departure_city TEXT DEFAULT "New Delhi (DEL)", activities_count INTEGER DEFAULT 5, discount_percentage INTEGER DEFAULT 15);
INSERT INTO TourPackages VALUES(1,'Magical Kashmir: Srinagar, Gulmarg & Pahalgam','magical-kashmir-srinagar-gulmarg-pahalgam','Honeymoon',6,5,28999.0,'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80','Experience the unparalleled beauty of Kashmir with scenic Shikara rides on Dal Lake, gondola cable rides in snow-covered Gulmarg, and serene pine valleys in Pahalgam.','Luxury Houseboat Stay, Daily Buffet Breakfast & Dinner, AC Sedan Transfers, Gondola Phase 1 Tickets, 1-Hour Shikara Ride','Flight Tickets, Personal Expenses, Lunch, Gondola Phase 2 Tickets, Travel Insurance','Free cancellation up to 15 days before departure. 50% charge between 7-14 days. Non-refundable within 7 days.',1,'2026-10-11 16:06:12',1,5,1,'New Delhi (DEL)',5,15);
INSERT INTO TourPackages VALUES(2,'Sun, Sand & Spice: Goa Coastal Extravaganza','sun-sand-spice-goa-coastal-extravaganza','Beach',5,4,18499.0,'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80','Unwind on the golden beaches of North & South Goa, visit historical Portuguese churches in Old Goa, and enjoy an evening sunset cruise along the Mandovi river.','4-Star Resort near Baga Beach, Daily Breakfast, Airport Transfers, Sunset River Cruise, North & South Goa Sightseeing','Water Sports charges, Lunch & Dinner, Monument entry tickets','Free cancellation up to 10 days before departure. 50% charge within 5-9 days.',1,'2026-10-11 16:06:12',1,3,0,'New Delhi (DEL)',5,15);
INSERT INTO TourPackages VALUES(3,'God’s Own Country: Munnar, Thekkady & Alleppey Houseboat','gods-own-country-munnar-thekkady-alleppey','Family',6,5,24500.0,'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80','Delight in rolling mist-covered tea gardens of Munnar, wildlife spice plantations in Thekkady, and a private traditional houseboat cruise in backwaters of Alleppey.','Private Deluxe Houseboat with all meals, 4-Star Resort in Munnar, AC Private Innova, Spice Plantation Tour, Kathakali Show','Airfare/Train fare, Lunch during hotel stay, Personal laundry and phone calls','Free cancellation up to 14 days before departure.',1,'2026-10-11 16:06:12',1,4,0,'New Delhi (DEL)',5,15);
INSERT INTO TourPackages VALUES(4,'Royal Rajasthan Heritage: Jaipur, Jodhpur & Udaipur','royal-rajasthan-heritage-jaipur-jodhpur-udaipur','Heritage',7,6,32000.0,'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80','Step into the grandeur of Rajasthan kings with royal palaces, mighty desert forts, camel rides, and romantic boat cruises across Lake Pichola.','Heritage Hotel Stays, Daily Royal Breakfast, AC Tempo Traveller, English Speaking Guide, Chokhi Dhani Dinner','Monument Camera Fees, Lunch, International/Domestic flights','Standard cancellation policy applies.',1,'2026-10-11 16:06:12',1,5,1,'New Delhi (DEL)',5,15);
INSERT INTO TourPackages VALUES(5,'Himalayan Thrills: Manali, Solang Valley & Rohtang Pass','himalayan-thrills-manali-solang-rohtang','Adventure',5,4,16999.0,'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80','Feel the mountain adrenaline with paragliding in Solang Valley, river rafting on Beas River, and exploring snow-capped Rohtang Pass.','3-Star Mountain View Hotel, Daily Breakfast & Dinner, Rohtang Pass Permit, Private SUV for sightseeing','Adventure sports tickets, Lunch, Winter gear rental','Free cancellation up to 7 days before departure.',1,'2026-10-11 16:06:12',1,4,0,'New Delhi (DEL)',5,15);
INSERT INTO TourPackages VALUES(6,'Spiritual Kashi: Varanasi Ghats, Sarnath & Ganga Aarti','spiritual-kashi-varanasi-sarnath-ganga-aarti','Spiritual',4,3,12500.0,'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80','Immerse in the timeless divinity of Varanasi, witness the grand Dashashwamedh Ghat evening aarti by boat, and visit Sarnath where Buddha gave his first sermon.','Riverside Hotel, Daily Vegetarian Breakfast, Sunrise & Evening Boat Rides on Ganga, Kashi Vishwanath Darshan Pass, Guide','Flight tickets, Lunch & Dinner, Personal donations','Standard cancellation rules.',1,'2026-10-11 16:06:12',1,3,0,'New Delhi (DEL)',5,15);
INSERT INTO TourPackages VALUES(7,'Emerald Islands: Andaman Coral Beach & Havelock Escape','emerald-islands-andaman-coral-havelock','Luxury',6,5,38500.0,'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80','Sail to pristine Havelock & Neil Islands, walk barefoot on Asia’s best Radhanagar beach, and snorkel among vibrant tropical reefs at Elephant Beach.','Makruzz Luxury Catamaran Ferry, 5-Star Beach Resort, Daily Breakfast, Snorkelling Session, Cellular Jail Light & Sound Show','Scuba Diving charges, Flights to Port Blair, Meals not specified','Strict island cancellation policy: 20 days prior for full refund.',1,'2026-10-11 16:06:12',1,4,0,'New Delhi (DEL)',5,15);
INSERT INTO TourPackages VALUES(8,'Queen of Hills: Ooty, Coonoor & Nilgiri Toy Train','queen-of-hills-ooty-coonoor-toy-train','Honeymoon',4,3,14999.0,'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80','Breathe fresh mountain eucalyptus air, ride the UNESCO Nilgiri Mountain Toy Train, stroll through Doddabetta Peak, and explore Coonoor tea gardens.','Colonial Heritage Cottage Stay, Daily Breakfast, Toy Train Reserved First Class Ticket, Private Sedan Cab','Lunch and Dinner, Botanical garden entry fees','Free cancellation up to 7 days prior.',1,'2026-10-11 16:06:12',1,4,0,'New Delhi (DEL)',5,15);
INSERT INTO TourPackages VALUES(9,'Golden Triangle Classic: Delhi, Agra & Jaipur','golden-triangle-classic-delhi-agra-jaipur','Heritage',5,4,21999.0,'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80','The iconic Indian cultural journey connecting the vibrant capital Delhi, the breathtaking Taj Mahal in Agra, and the royal Pink City Jaipur.','4-Star Hotels, AC Sedan with chauffeur, Taj Mahal Sunrise Guided Tour, Daily Breakfast, Toll & State Taxes','Monument entry charges, Lunch and Dinner, Tips to driver/guide','Full refund if cancelled 10 days before departure.',1,'2026-10-11 16:06:12',1,4,0,'New Delhi (DEL)',5,15);
INSERT INTO TourPackages VALUES(10,'Romantic City of Lakes: Udaipur Palace & Lake Pichola','romantic-city-of-lakes-udaipur-palace','Luxury',4,3,22499.0,'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80','Indulge in pure Mewari royalty with lakeside candlelight dinners, private boat ride around Jag Mandir, and royal guided walk through City Palace.','Lake View 5-Star Hotel, Private Boat Cruise, Daily Royal Breakfast, Vintage Car Museum Tour, Private Chauffeur','Airfare, Personal shopping, Alcoholic beverages','Full refund up to 14 days before departure.',1,'2026-10-11 16:06:12',1,5,1,'New Delhi (DEL)',5,15);
INSERT INTO TourPackages VALUES(11,'Wild Wilderness: Ranthambore & Sariska Tiger Safari','wild-wilderness-ranthambore-sariska-tiger-safari','Wildlife',5,4,26000.0,'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80','Venture into the heart of Royal Bengal Tiger territory with 4 exclusive jungle open-top gypsy safaris led by expert naturalists.','Jungle Eco-Lodge, All Meals (Breakfast, Lunch, Dinner), 4 Gypsy Forest Safaris with Naturalist, Forest Permits','Airfare/Train transfers, Camera lens fees','Safari permits are non-refundable once booked.',1,'2026-10-11 16:06:12',1,4,0,'New Delhi (DEL)',5,15);
INSERT INTO TourPackages VALUES(12,'Goa Monsoon Lush & Dudhsagar Waterfall Trek','goa-monsoon-dudhsagar-waterfall-trek','Adventure',4,3,13500.0,'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80','Discover Goa beyond beaches: trek through lush Western Ghats jungles to the roaring milky Dudhsagar waterfalls and spice valleys.','Boutique Forest Villa, Trekking Guide, Off-road 4x4 Jeep Safari, Daily Breakfast, Traditional Goan Thali Lunch','Personal gear, Alcohol, Dinner','Full refund up to 5 days before departure.',1,'2026-10-11 16:06:12',1,4,0,'New Delhi (DEL)',5,15);
INSERT INTO TourPackages VALUES(13,'Divine Gateway: Haridwar & Rishikesh Yoga River Camp','divine-gateway-haridwar-rishikesh-yoga','Spiritual',4,3,11500.0,'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80','Find serenity with daily morning riverside yoga, 16km Ganga whitewater rafting, campfire evenings, and Har Ki Pauri Ganga Aarti.','Riverside Alpine Camp, Daily Yoga Sessions, River Rafting with Safety Gear, All Meals, Local Guide','Transport to Rishikesh, Personal expenses','Full refund up to 7 days before departure.',1,'2026-10-11 16:06:12',1,3,0,'New Delhi (DEL)',5,15);
INSERT INTO TourPackages VALUES(14,'Wayanad Mist: Treehouse & Tea Plantation Trails','wayanad-mist-treehouse-tea-plantation-trails','Family',4,3,17500.0,'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80','Stay in authentic luxury bamboo treehouses, hike through chembra heart lake, and explore ancient prehistoric Edakkal caves.','Luxury Treehouse Resort, Daily Breakfast & Dinner, Plantation Walk, Private Cab for Sightseeing','Cave entry tickets, Lunch, Airfare','Full refund up to 10 days before departure.',1,'2026-10-11 16:06:12',1,4,0,'New Delhi (DEL)',5,15);
INSERT INTO TourPackages VALUES(15,'Ladakh High Altitude Odyssey: Leh, Nubra & Pangong Lake','ladakh-high-altitude-odyssey-leh-nubra-pangong','Adventure',7,6,36000.0,'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80','Conquer the world’s highest motorable pass Khardung La, ride double-humped camels in Hunder sand dunes, and camp beside the magical blue Pangong Tso.','Oxygen-equipped SUV Cab, Deluxe Swiss Camps at Pangong, Inner Line Permits, Daily Breakfast & Dinner, Experienced Mountain Guide','Flights to Leh, Lunch, Personal oxygen cylinder, Camel ride','Strict Ladakh environmental permit cancellation rules.',1,'2026-10-11 16:06:12',1,4,0,'New Delhi (DEL)',5,15);
INSERT INTO TourPackages VALUES(16,'Paris Romantic Getaway','paris-romantic-getaway','Romantic / City Tour',5,4,75000.0,'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80','Discover the City of Light with romantic Seine River cruises, Eiffel Tower summit champagne views, and world-renowned Louvre masterpieces.','4-Star Boutique Hotel in Paris, Daily French Buffet Breakfast, Eiffel Tower Priority Access, 1-Hour Champagne Seine Cruise, Louvre Guided Tour','International Airfare, Schengen Visa Fees, Lunch & Dinner, City Tourist Tax, Travel Insurance','Free cancellation up to 15 days before departure. 50% cancellation fee between 7-14 days. Non-refundable within 7 days.',1,'2026-10-11 16:57:40',0,5,1,'New Delhi (DEL)',5,15);
INSERT INTO TourPackages VALUES(17,'Swiss Alps Adventure','swiss-alps-adventure','Adventure / Nature',7,6,150000.0,'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80','Traverse pristine alpine wonderland with scenic mountain cogwheel railways, crystal alpine lakes of Lucerne & Brienz, and the Jungfraujoch Top of Europe glacier.','5-Star Alpine Resort in Interlaken & Lucerne, Swiss All-in-One Rail Pass, Jungfraujoch Glacier Tickets, Mount Pilatus Cogwheel Train, Daily Breakfast & Dinner','Flights to Zurich, Personal Mountaineering Equipment, Lunch, Alpine Ski Rental, Schengen Visa','Free cancellation up to 21 days before departure. 50% between 10-20 days. Strict alpine permit conditions.',1,'2026-10-11 16:57:40',0,5,1,'New Delhi (DEL)',5,15);
INSERT INTO TourPackages VALUES(18,'Bali Island Escape','bali-island-escape','Beach / Leisure',5,4,45000.0,'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80','Immerse in tropical bliss: verdant Ubud rice terraces, roaring Tegenungan waterfalls, sacred cliffside temples, and golden beach sunsets in Seminyak.','Private Luxury Pool Villa in Ubud, Daily Breakfast, Private AC Chauffeur Van, Sunset Jimbaran Seafood Dinner, Waterfalls Guided Trek','International Flights, Water Sports Charges, Personal Laundry, Indonesia Visa on Arrival ($35)','Free cancellation up to 10 days before departure. Full refund if cancelled 14 days prior.',1,'2026-10-11 16:57:40',0,4,0,'New Delhi (DEL)',5,15);
INSERT INTO TourPackages VALUES(19,'Japan Cultural Discovery','japan-cultural-discovery','Cultural / City Tour',7,6,120000.0,'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80','Experience the captivating contrast of high-tech Tokyo and historic Kyoto, ride the Shinkansen bullet train, and behold majestic Mount Fuji.','4-Star Modern Hotel in Tokyo & Kyoto, Shinkansen High-Speed Bullet Train Ticket, Mount Fuji & Lake Kawaguchi Day Tour, Traditional Tea Ceremony, English Guide','International Airfare, Japan Visa, Lunch & Dinner, Baggage Courier, Personal Purchases','Free cancellation up to 15 days before departure.',1,'2026-10-11 16:57:40',0,5,1,'New Delhi (DEL)',5,15);
INSERT INTO TourPackages VALUES(20,'Dubai Luxury Experience','dubai-luxury-experience','Luxury / Shopping',5,4,60000.0,'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80','Indulge in pure Arabian luxury with Burj Khalifa 124th floor observatory, red dune desert safari with BBQ dinner, Dubai Marina yacht cruises, and mega mall shopping.','5-Star Marina Waterfront Hotel, At The Top Burj Khalifa Tickets, 4x4 Dune Bashing Desert Safari, 2-Hour Dubai Marina Luxury Yacht Cruise, Daily Breakfast','International Airfare, UAE Visa Fee, Tourism Dirham Tax, Personal Shopping in Gold Souk','Free cancellation up to 7 days before departure.',1,'2026-10-11 16:57:40',0,5,1,'New Delhi (DEL)',5,15);
INSERT INTO TourPackages VALUES(21,'Maldives Island Retreat','maldives-island-retreat','Luxury / Honeymoon',4,3,85000.0,'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80','Escape to turquoise paradise with luxury overwater villas, coral reef snorkeling with turtles, dolphin watching sunset cruises, and private beach dining.','5-Star Overwater Sunrise Villa, Speedboat Transfers from Velana Airport, All Inclusive Meals (Breakfast, Lunch, Dinner & Drinks), Guided Snorkeling Safari','International Flights, Scuba Diving Certification, Spa Treatments, Seaplane Upgrades','Strict resort island cancellation: Full refund up to 20 days prior to arrival.',1,'2026-10-11 16:57:40',0,5,1,'New Delhi (DEL)',5,15);
INSERT INTO TourPackages VALUES(22,'New York City Explorer','new-york-city-explorer','City Tour / Shopping',6,5,180000.0,'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80','Experience the energy of the Big Apple with Times Square, Statue of Liberty ferry, Central Park bike tour, Broadway show, and 5th Avenue shopping.','4-Star Manhattan Grand Central Hotel, Statue of Liberty & Ellis Island Cruise, Summit One Vanderbilt Tickets, Broadway Show Reserved Orchestra Seat, Daily Breakfast','International Flights, US B1/B2 Visa, Subway Passes, Lunch & Dinner, Personal Shopping','Free cancellation up to 14 days before departure.',1,'2026-10-11 16:57:40',0,5,1,'New Delhi (DEL)',5,15);
INSERT INTO TourPackages VALUES(23,'Sydney Coastal Holiday','sydney-coastal-holiday','Beach / City Tour',6,5,140000.0,'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80','Bask in the Australian sunshine with Sydney Opera House tour, Sydney Harbour sunset dinner cruise, Bondi Beach coastal walk, and Blue Mountains day trip.','5-Star Sydney Harbour Luxury Hotel, Sydney Opera House Guided Tour, Harbour Sunset Dinner Cruise, Blue Mountains Scenic World Pass, Daily Breakfast','International Flights, Australian Tourist Visa, Lunch, Surfing Equipment Rental','Free cancellation up to 14 days before departure.',1,'2026-10-11 16:57:40',0,4,0,'New Delhi (DEL)',5,15);
INSERT INTO TourPackages VALUES(24,'Cape Town Nature Tour','cape-town-nature-tour','Nature / Adventure',6,5,110000.0,'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80','Discover the tip of the African continent with Table Mountain aerial cableway, Cape Peninsula scenic drive, Boulders Beach penguin colony, and Stellenbosch vineyards.','4-Star Waterfront Hotel in Cape Town, Table Mountain Cableway Return Ticket, Cape Peninsula Full Day Tour, Boulders Beach Penguin Entry, Daily Breakfast','International Airfare, South Africa Visa, Wine Tasting Fees, Personal Expenses','Free cancellation up to 10 days before departure.',1,'2026-10-11 16:57:40',0,4,0,'New Delhi (DEL)',5,15);
INSERT INTO TourPackages VALUES(25,'Rio de Janeiro Adventure','rio-de-janeiro-adventure','Adventure / Beach',6,5,130000.0,'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80','Live the Brazilian rhythm with Corcovado mountain train to Christ the Redeemer, Sugarloaf cable car over Guanabara Bay, and Copacabana beach strolls.','5-Star Copacabana Beachfront Hotel, Christ the Redeemer Cog Train & Entry, Sugarloaf Mountain Cableway, Tijuca Rainforest Jeep Tour, Daily Breakfast','International Airfare, Brazil Visa, Samba Nightclub Entry, Lunch and Dinner','Free cancellation up to 14 days before departure.',1,'2026-10-11 16:57:40',0,4,0,'New Delhi (DEL)',5,15);
INSERT INTO TourPackages VALUES(26,'Dreamy Himalayan Honeymoon: Srinagar Dal Lake & Gulmarg Gondola','dreamy-himalayan-honeymoon','Honeymoon',6,5,32000.0,'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80','Indulge in a fairy-tale honeymoon in the paradise of Kashmir with a romantic Dal Lake Shikara ride, stays in an intricately carved cedarwood houseboat, and breathtaking snow cable-car rides in Gulmarg.','5-Star Deluxe Houseboat & Luxury Hotel, Daily Breakfast & Candlelight Dinner, Shikara Ride, Gulmarg Gondola Phase 1 Tickets, AC Private Sedan Transfers','Personal shopping, Gondola Phase 2 tickets, Travel insurance','Free cancellation up to 15 days before departure with 90% refund.',1,'2026-10-11 17:35:35',1,5,1,'New Delhi (DEL)',6,20);
INSERT INTO TourPackages VALUES(27,'Romantic Kerala Vacation: Munnar Tea Hills, Thekkady & Alleppey Cruise','romantic-kerala-vacation','Romantic / City Tour',6,5,27500.0,'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80','Escape to lush emerald green hills of Munnar, wildlife spice plantations in Thekkady, and a private backwater houseboat cruise through Alleppey with authentic Kerala cuisine.','4-Star Plantation Resort & Private Houseboat, Daily Breakfast & Dinner, Spice Plantation Guided Tour, All Intercity AC Transfers','Airfare to Kochi, Personal Ayurveda treatments, Laundry','Free cancellation up to 10 days before departure with 85% refund.',1,'2026-10-11 17:35:35',1,4,0,'Bangalore (BLR)',5,15);
INSERT INTO TourPackages VALUES(28,'Dazzling South India Honeymoon: Ooty Pines, Coonoor & Kodaikanal Mist','dazzling-south-india-honeymoon','Honeymoon',6,5,29000.0,'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80','Breathe in the cool eucalyptus mist of the Nilgiris. Experience romantic strolls by Ooty Lake, heritage Nilgiri Toy Train ride through mountain tunnels, and tea tasting in Coonoor.','4-Star Heritage Hill Resort, Daily Breakfast & Candlelight Dinner, Nilgiri Mountain Toy Train First Class Tickets, Private AC Chauffeur Car','Lunches, Boating charges at Kodaikanal Lake, Personal tips','Free cancellation up to 12 days prior with 85% refund.',1,'2026-10-11 17:35:35',1,4,0,'Chennai (MAA)',5,12);
INSERT INTO TourPackages VALUES(29,'Himachal Retreat: Shimla Mall Road, Kufri & Manali Solang Valley','himachal-retreat','Family',6,5,22000.0,'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80','A comprehensive mountain vacation across Himachal Pradesh, featuring colonial Shimla architecture, Himalayan snow panoramas in Kufri, and paragliding thrills in Manali Solang Valley.','4-Star Valley View Resort, Daily Breakfast & Dinner, Solang Valley Sightseeing, AC Tempo Traveller / Innova transfers','Adventure sports equipment hire, Rohtang Pass special permit fee, Personal expenses','Free cancellation up to 14 days before departure with 90% refund.',1,'2026-10-11 17:35:35',1,4,0,'New Delhi (DEL)',6,18);
INSERT INTO TourPackages VALUES(30,'Super Saver Goa Holiday: Calangute, Baga & Mandovi River Sunset Cruise','super-saver-goa-holiday','Beach',4,3,14500.0,'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80','Enjoy sun-drenched golden sands, coastal shacks, Portuguese colonial churches in Old Goa, and an evening cultural folk cruise across the Mandovi River at unbeatable value.','3-Star Beach Resort with Swimming Pool, Daily Breakfast, North & South Goa Sightseeing Tour, Airport Pickup & Drop','Watersports fees, Alcoholic beverages, Monument entry tickets','Free cancellation up to 7 days before departure with 80% refund.',1,'2026-10-11 17:35:35',1,3,0,'Mumbai (BOM)',4,25);
INSERT INTO TourPackages VALUES(31,'Thailand Tropical Paradise: Bangkok City & Phuket Phi Phi Island','thailand-tropical-paradise','Beach / Leisure',6,5,54000.0,'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80','Experience the dazzling temples and vibrant street night markets of Bangkok combined with crystal azure waters, limestone karsts, and speed-boat island hopping in Phuket and Maya Bay.','Return International Flights, 4-Star Beachfront & City Hotels, Daily Breakfast, Speedboat Tour to Phi Phi Islands with Lunch, All Transfers','Thailand Visa on Arrival fee, National Park marine entry fee, Personal shopping','Free cancellation up to 21 days before departure with 80% refund.',1,'2026-10-11 17:35:35',0,4,1,'Kolkata (CCU)',6,15);
INSERT INTO TourPackages VALUES(32,'Singapore Futuristic Wonderland: Marina Bay, Sentosa & Universal Studios','singapore-futuristic-wonderland','Family',5,4,72000.0,'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80','Step into the future with Singapore Garden by the Bay light show, stunning Marina Bay Sands SkyPark, cable car to Sentosa Island, and all-day thrills at Universal Studios theme park.','Return International Flights, 4-Star Orchard Road Hotel, Daily Breakfast, Universal Studios One-Day Pass, Sentosa Cable Car, Gardens by the Bay Tickets','Singapore Tourist Visa, Dinners, Personal shopping along Orchard Road','Free cancellation up to 20 days before departure with 85% refund.',1,'2026-10-11 17:35:35',0,5,1,'Mumbai (BOM)',7,10);
CREATE TABLE IF NOT EXISTS "Transport" (
            transport_id INTEGER PRIMARY KEY AUTOINCREMENT,
            vehicle_type TEXT NOT NULL,
            capacity INTEGER NOT NULL CHECK(capacity > 0),
            registration_number TEXT NOT NULL UNIQUE,
            operator_name TEXT NOT NULL,
            contact_phone TEXT
        );
INSERT INTO Transport VALUES(1,'SUV (Innova)',6,'JK-01-AB-1234','Kashmir Valley Chauffeurs','+91 94190 12345');
INSERT INTO Transport VALUES(2,'Tempo Traveller',12,'GA-03-T-5678','Goa Holiday Shuttles','+91 98221 45678');
INSERT INTO Transport VALUES(3,'Houseboat',10,'KL-04-HB-9012','Alleppey Backwater Fleet','+91 94471 23456');
INSERT INTO Transport VALUES(4,'Luxury Coach Bus',35,'RJ-14-PB-3456','Royal Rajputana Coaches','+91 98290 67890');
INSERT INTO Transport VALUES(5,'SUV (Innova)',6,'HP-01-M-7890','Himalayan Ridge Drives','+91 98160 54321');
INSERT INTO Transport VALUES(6,'Luxury Coach Bus',45,'FR-PAR-901','EuroTour Paris Luxury Fleet','+33 1 40 50 60 70');
INSERT INTO Transport VALUES(7,'Scenic Mountain Railway',60,'CH-ALP-102','Swiss Alpine Railway Pass','+41 33 828 71 11');
INSERT INTO Transport VALUES(8,'SUV (Innova)',7,'ID-BAL-304','Bali Island Chauffeur Fleet','+62 812 3456 7890');
INSERT INTO Transport VALUES(9,'Bullet Train (Shinkansen)',100,'JP-SHK-700','JR East & West Rail Service','+81 3 3423 0111');
INSERT INTO Transport VALUES(10,'Luxury Coach Bus',30,'AE-DXB-555','Emirates Royal Limousine & Coach','+971 4 224 8888');
INSERT INTO Transport VALUES(11,'Speedboat / Ferry',25,'MV-MAL-007','Maldives Atoll Speedboat Transfer','+960 779 1234');
INSERT INTO Transport VALUES(12,'Tempo Traveller',15,'US-NYC-882','Manhattan Premium Sightseeing Transit','+1 212 555 0199');
INSERT INTO Transport VALUES(13,'Luxury Coach Bus',40,'AU-SYD-414','Sydney Coastal Coach Lines','+61 2 9319 8888');
INSERT INTO Transport VALUES(14,'Tempo Traveller',14,'ZA-CPT-220','Cape Peninsula Discovery Shuttles','+27 21 555 4321');
INSERT INTO Transport VALUES(15,'Tempo Traveller',15,'BR-RIO-610','Rio Tropical Sightseeing Vans','+55 21 98765 4321');
CREATE TABLE Reviews (
    review_id INTEGER PRIMARY KEY AUTOINCREMENT,
    package_id INTEGER NOT NULL REFERENCES TourPackages(package_id) ON DELETE CASCADE,
    customer_id INTEGER NOT NULL REFERENCES Customers(customer_id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO Reviews VALUES(1,1,1,5,'The houseboat stay on Dal Lake was magical! Perfect pacing and our guide Rajesh was wonderful.','2026-10-11 17:35:35');
INSERT INTO Reviews VALUES(2,2,2,5,'Great Goa vacation, resort was 2 minutes from the beach and the sunset cruise was highlight.','2026-10-11 17:35:35');
INSERT INTO Reviews VALUES(3,16,1,5,'Paris was a dream! The Seine river cruise and skip-the-line Eiffel tower permits saved hours.','2026-10-11 17:35:35');
INSERT INTO Reviews VALUES(4,17,2,5,'Swiss Alps adventure was breathtaking. The scenic mountain railways are unbeatable.','2026-10-11 17:35:35');
INSERT INTO Reviews VALUES(5,26,1,5,'Unbelievable honeymoon in Kashmir. The candlelight dinner on the houseboat will stay with us forever.','2026-10-11 17:35:35');
INSERT INTO Reviews VALUES(6,31,2,5,'Phi Phi islands tour was out of this world! Highly recommend GlobeTrek!','2026-10-11 17:35:35');
INSERT INTO Reviews VALUES(7,32,1,5,'Universal Studios Singapore was thoroughly enjoyed by the whole family. Flawless arrangements.','2026-10-11 17:35:35');
CREATE TABLE Favourites (
    favourite_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL REFERENCES Customers(customer_id) ON DELETE CASCADE,
    package_id INTEGER NOT NULL REFERENCES TourPackages(package_id) ON DELETE CASCADE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(customer_id, package_id)
);
PRAGMA writable_schema=ON;
CREATE TABLE IF NOT EXISTS sqlite_sequence(name,seq);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('Users',14);
INSERT INTO sqlite_sequence VALUES('Customers',5);
INSERT INTO sqlite_sequence VALUES('Destinations',55);
INSERT INTO sqlite_sequence VALUES('Hotels',20);
INSERT INTO sqlite_sequence VALUES('Guides',8);
INSERT INTO sqlite_sequence VALUES('ItineraryDays',178);
INSERT INTO sqlite_sequence VALUES('Departures',40);
INSERT INTO sqlite_sequence VALUES('GuideAssignments',14);
INSERT INTO sqlite_sequence VALUES('Bookings',15);
INSERT INTO sqlite_sequence VALUES('Travellers',25);
INSERT INTO sqlite_sequence VALUES('Payments',8);
INSERT INTO sqlite_sequence VALUES('Cancellations',8);
INSERT INTO sqlite_sequence VALUES('Refunds',1);
INSERT INTO sqlite_sequence VALUES('TourPackages',32);
INSERT INTO sqlite_sequence VALUES('Transport',15);
INSERT INTO sqlite_sequence VALUES('Countries',40);
INSERT INTO sqlite_sequence VALUES('PackageCategories',14);
INSERT INTO sqlite_sequence VALUES('Reviews',7);
CREATE VIEW AvailableDeparturesView AS
SELECT 
    d.departure_id,
    p.package_id,
    p.title AS package_title,
    p.category,
    p.duration_days,
    p.duration_nights,
    COALESCE(d.price_override, p.base_price) AS effective_price,
    d.start_date,
    d.end_date,
    d.total_capacity,
    d.confirmed_seats,
    (d.total_capacity - d.confirmed_seats) AS available_seats,
    d.status AS departure_status,
    g.full_name AS assigned_guide,
    t.vehicle_type AS assigned_transport
FROM Departures d
JOIN TourPackages p ON d.package_id = p.package_id
LEFT JOIN Guides g ON d.guide_id = g.guide_id
LEFT JOIN Transport t ON d.transport_id = t.transport_id
WHERE d.status IN ('Published', 'Confirmed');
CREATE VIEW BookingDetailsView AS
SELECT 
    b.booking_id,
    b.booking_reference,
    b.booking_date,
    c.customer_id,
    c.full_name AS customer_name,
    c.phone AS customer_phone,
    u.email AS customer_email,
    p.package_id,
    p.title AS package_title,
    d.start_date,
    d.end_date,
    b.traveller_count,
    b.net_amount,
    b.booking_status,
    pay.payment_status,
    pay.payment_method,
    pay.payment_reference
FROM Bookings b
JOIN Customers c ON b.customer_id = c.customer_id
JOIN Users u ON c.user_id = u.user_id
JOIN Departures d ON b.departure_id = d.departure_id
JOIN TourPackages p ON d.package_id = p.package_id
LEFT JOIN Payments pay ON b.booking_id = pay.booking_id;
CREATE VIEW GuideScheduleView AS
SELECT 
    g.guide_id,
    g.full_name AS guide_name,
    g.phone AS guide_phone,
    g.languages,
    d.departure_id,
    p.title AS package_title,
    d.start_date,
    d.end_date,
    d.confirmed_seats AS travellers_count,
    d.status AS departure_status,
    t.vehicle_type,
    t.registration_number AS vehicle_plate
FROM Guides g
JOIN Departures d ON g.guide_id = d.guide_id
JOIN TourPackages p ON d.package_id = p.package_id
LEFT JOIN Transport t ON d.transport_id = t.transport_id
ORDER BY d.start_date ASC;
CREATE VIEW MonthlyRevenueView AS
SELECT 
    strftime('%Y-%m', pay.transaction_date) AS month_year,
    COUNT(DISTINCT b.booking_id) AS total_bookings,
    SUM(CASE WHEN pay.payment_status = 'Successful' THEN pay.amount ELSE 0.0 END) AS gross_revenue,
    COALESCE(SUM(r.refund_amount), 0.0) AS total_refunded,
    (SUM(CASE WHEN pay.payment_status = 'Successful' THEN pay.amount ELSE 0.0 END) - COALESCE(SUM(r.refund_amount), 0.0)) AS net_revenue
FROM Payments pay
JOIN Bookings b ON pay.booking_id = b.booking_id
LEFT JOIN Cancellations c ON b.booking_id = c.booking_id
LEFT JOIN Refunds r ON c.cancellation_id = r.cancellation_id AND r.refund_status = 'Processed'
WHERE pay.payment_status = 'Successful'
GROUP BY strftime('%Y-%m', pay.transaction_date)
ORDER BY month_year DESC;
CREATE VIEW CancellationRefundView AS
SELECT 
    c.cancellation_id,
    b.booking_reference,
    cust.full_name AS customer_name,
    p.title AS package_title,
    b.net_amount AS total_booking_amount,
    c.cancellation_fee,
    c.refundable_amount,
    c.cancellation_date,
    c.reason,
    r.refund_id,
    COALESCE(r.refund_amount, 0.0) AS refund_amount,
    COALESCE(r.refund_status, 'Pending') AS refund_status,
    r.refund_date
FROM Cancellations c
JOIN Bookings b ON c.booking_id = b.booking_id
JOIN Customers cust ON b.customer_id = cust.customer_id
JOIN Departures d ON b.departure_id = d.departure_id
JOIN TourPackages p ON d.package_id = p.package_id
LEFT JOIN Refunds r ON c.cancellation_id = r.cancellation_id;
CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_users_role ON Users(role);
CREATE INDEX idx_customers_phone ON Customers(phone);
CREATE INDEX idx_destinations_name ON Destinations(name);
CREATE INDEX idx_destinations_popular ON Destinations(is_popular);
CREATE INDEX idx_pd_dest ON PackageDestinations(destination_id);
CREATE INDEX idx_hotels_dest ON Hotels(destination_id);
CREATE INDEX idx_guides_phone ON Guides(phone);
CREATE INDEX idx_departures_dates ON Departures(start_date, end_date);
CREATE INDEX idx_departures_status ON Departures(status);
CREATE INDEX idx_bookings_ref ON Bookings(booking_reference);
CREATE INDEX idx_bookings_cust ON Bookings(customer_id);
CREATE INDEX idx_bookings_status ON Bookings(booking_status);
CREATE INDEX idx_payments_status ON Payments(payment_status);
CREATE INDEX idx_payments_ref ON Payments(payment_reference);
CREATE INDEX idx_packages_category ON TourPackages(category);
CREATE INDEX idx_packages_price ON TourPackages(base_price);
CREATE INDEX idx_packages_active ON TourPackages(is_active);
PRAGMA writable_schema=OFF;
COMMIT;
