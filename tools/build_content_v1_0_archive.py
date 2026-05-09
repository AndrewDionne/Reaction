import json
from pathlib import Path

units = [
    {"id":"9A","title":"9A Genetics and evolution","theme":"Variation, inheritance, DNA, biodiversity, natural selection"},
    {"id":"9B","title":"9B Plant growth","theme":"Photosynthesis, plant adaptations, plant products, crops and food webs"},
    {"id":"9E","title":"9E Making materials","theme":"Ceramics, polymers, composites, environmental impacts and recycling"},
    {"id":"9F","title":"9F Reactivity and extraction","theme":"Chemical reactions, reactivity, energy changes, displacement and extracting metals"},
    {"id":"9I","title":"9I Forces and motion","theme":"Forces, energy, speed, levers, moments, simple machines and work done"},
    {"id":"9J","title":"9J Force fields and electromagnets","theme":"Gravity, static electricity, circuits, resistance, electromagnets and motors"},
]

cards = []

def slug(s):
    import re
    return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')[:70]

def add(unit, typ, question, answer, choices=None, explanation='', source='', level=1, cue='', tags=None):
    idx = len(cards)+1
    cards.append({
        "id": f"y9-{idx:03d}-{unit.lower()}-{slug(question)}",
        "unit": unit,
        "type": typ,
        "question": question,
        "answer": answer,
        "choices": choices or [],
        "explanation": explanation,
        "source": source,
        "level": int(level),
        "cue": cue,
        "tags": tags or []
    })

# ---------------------------------------------------------------------------
# Quick Quiz cards - reconstructed from the PDF quick quizzes in the Year 9 pack.
# Some original diagram-dependent questions are converted to text prompts while
# keeping the same learning target and answer.
# ---------------------------------------------------------------------------

# 9A
add('9A','Quick quiz','Variation is:','C', ['A a disease','B the scientific name for fertilisation','C differences in characteristics','D similarities in characteristics'], 'Variation means differences in characteristics.', '9A quick quiz 9Aa Q1', 1)
add('9A','Quick quiz','Of the following, which is the best example of an environmental variation?','A', ['A a suntan','B blood group','C chin shape','D having ear lobes'], 'A suntan is caused by exposure to sunlight, an environmental factor.', '9A quick quiz 9Aa Q2', 1)
add('9A','Quick quiz','Environmental variation is caused:','B', ['A when organisms breed','B by environmental factors','C by varieties','D by problems in the brains of some animals'], 'Environmental variation is caused by conditions in the surroundings.', '9A quick quiz 9Aa Q3', 1)
add('9A','Quick quiz','What sort of variation is shown when measurements can take any value over a range?','D', ['A disrespectful','B dominant','C discontinuous','D continuous'], 'Measurements such as height, length and mass show continuous variation.', '9A quick quiz 9Aa Q4 - text reconstruction of chart question', 2)
add('9A','Quick quiz','Of the following, which is the best example of an inherited variation?','A', ['A eye colour','B speaking Spanish','C a scar','D a broken leg'], 'Eye colour is controlled mainly by genetic information inherited from parents.', '9A quick quiz 9Ab Q1', 1)
add('9A','Quick quiz','Inherited characteristics in humans are caused by:','C', ['A blood','B children learning things from their parents and at school','C genetic information','D the country in which children grow up'], 'Inherited characteristics are controlled by genetic information.', '9A quick quiz 9Ab Q2', 1)
add('9A','Quick quiz','Genetic information can be found in a sperm cell in the:','D', ['A cytoplasm','B tail','C tip of the head','D nucleus'], 'The nucleus contains the genetic information.', '9A quick quiz 9Ab Q3', 1)
add('9A','Quick quiz','The overall bell shape on a continuous variation chart is called:','C', ['A even distribution','B uneven distribution','C normal distribution','D norman distribution'], 'Continuous variation often forms a normal distribution.', '9A quick quiz 9Ab Q4', 2)
add('9A','Quick quiz','Each chromosome contains one molecule of a certain substance. What is this substance?','C', ['A integrin','B deoxyribodipyrimidine','C DNA','D protein'], 'Chromosomes are made from long DNA molecules.', '9A quick quiz 9Ac Q1', 1)
add('9A','Quick quiz','The total number of chromosomes in a human liver cell is 46. So the number of chromosomes in a human egg cell is:','A', ['A 23','B 46','C 92','D 0'], 'Gametes have half the chromosome number of ordinary body cells.', '9A quick quiz 9Ac Q2', 2)
add('9A','Quick quiz','A gene is:','B', ['A the first part of an organism’s scientific name','B a short section of a chromosome','C a type of cell','D a molecule found in the nucleus of cells'], 'A gene is a section of DNA on a chromosome.', '9A quick quiz 9Ac Q3', 1)
add('9A','Quick quiz','The structure of the long molecule found in chromosomes was worked out by:','C', ['A Holmes and Watson','B Bonnie and Clyde','C Watson and Crick','D Adenine and Thymine'], 'Watson and Crick are associated with the DNA double helix model.', '9A quick quiz 9Ac Q4', 1)
add('9A','Quick quiz','Which of these is least likely to cause the endangerment of a species?','C', ['A changes in physical environmental factors','B competition from other organisms','C decrease in predators','D human activities'], 'A decrease in predators would usually reduce pressure on a prey species.', '9A quick quiz 9Ad Q1', 2)
add('9A','Quick quiz','Which of these is least likely to be used for conservation?','B', ['A banning the sale of items made from a certain animal','B creating a reservoir','C setting up a nature reserve','D building a zoo'], 'Nature reserves, bans and zoos can all support conservation.', '9A quick quiz 9Ad Q2', 2)
add('9A','Quick quiz','Which feature of an animal suggests that it is prey for larger animals?','A', ['A spines on its body','B long nose','C small ears','D whiskers'], 'Spines can act as a defence against predators.', '9A quick quiz 9Ad Q3', 2)
add('9A','Quick quiz','Which of these would you expect to find in a gene bank?','A', ['A gametes','B single genes','C money for conservation projects','D sand'], 'Gene banks can store gametes or seeds to preserve genetic diversity.', '9A quick quiz 9Ad Q4', 2)
add('9A','Quick quiz','Adult birds of the same species have slightly different beak lengths. With plenty of food and no disease, the cause of the difference is most likely to be:','D', ['A environmental factors','B how much the birds use their beaks','C how much the birds stretch their beaks','D genes'], 'Small inherited differences between individuals are caused by genes.', '9A quick quiz 9Ae Q1', 2)
add('9A','Quick quiz','If there is plenty of food, what will happen to the number of longer-beaked birds compared with shorter-beaked birds?','C', ['A The number of longer-beaked birds will go down','B The number of longer-beaked birds will go up','C The numbers will not change much','D Longer-beaked birds will disappear altogether'], 'If the difference gives no advantage, there is little selection pressure.', '9A quick quiz 9Ae Q2', 3)
add('9A','Quick quiz','Evolution is:','B', ['A what happens after an organism becomes endangered','B a gradual change in the characteristics of organisms over time','C when organisms decide to change their features','D something that only affected animals such as dinosaurs'], 'Evolution is gradual change in inherited characteristics over generations.', '9A quick quiz 9Ae Q3', 1)
add('9A','Quick quiz','The theory of evolution that most scientists believe today was put forward by:','D', ['A Hall and Oates','B Orville and Wilbur Wright','C Lamarck and Drinker Cope','D Wallace and Darwin'], 'Darwin and Wallace independently developed the idea of natural selection.', '9A quick quiz 9Ae Q4', 1)

# 9B
add('9B','Quick quiz','Where does photosynthesis occur in a plant?','C', ['A in part Q only','B in part R only','C in the green parts such as leaves and green stems','D in all the parts'], 'Photosynthesis occurs in chloroplast-containing green tissues, especially leaves.', '9B quick quiz 9Ba Q1 - text reconstruction of labelled diagram', 1)
add('9B','Quick quiz','In the summary of aerobic respiration, glucose + oxygen -> carbon dioxide + X, what is X?','A', ['A water','B nitrogen','C carbon monoxide','D air'], 'Aerobic respiration produces carbon dioxide and water.', '9B quick quiz 9Ba Q2', 1)
add('9B','Quick quiz','What does a photosynthesis-rate graph usually show as light intensity increases?','A', ['A The more light, the faster photosynthesis gets until a certain level is reached','B The more light, the faster photosynthesis gets, but above a certain amount it slows down','C The faster photosynthesis gets, the more light is produced','D The less light, the faster photosynthesis gets'], 'Light can be a limiting factor until another factor limits the rate.', '9B quick quiz 9Ba Q3 - text reconstruction of graph question', 2)
add('9B','Quick quiz','Which sentence best describes what chlorophyll does?','B', ['A It gives out energy','B It traps energy','C It is green','D It allows the plant to respire aerobically'], 'Chlorophyll absorbs light energy for photosynthesis.', '9B quick quiz 9Ba Q4', 1)
add('9B','Quick quiz','Leaves are often wide so that they:','C', ['A provide shelter for animals','B float to the ground in autumn','C have a large surface area for trapping light from the Sun','D have a large surface area for trapping rain'], 'A large surface area helps leaves absorb more light.', '9B quick quiz 9Bb Q1', 1)
add('9B','Quick quiz','Roots are adapted to their function by:','D', ['A being a pale colour','B having cells that can respire','C having cells that can photosynthesise','D having many branches and being spread out'], 'Branching roots increase surface area for water and mineral uptake.', '9B quick quiz 9Bb Q2', 1)
add('9B','Quick quiz','If plants do not get enough water they start to:','D', ['A grow towards the light','B grow away from the light','C shrink','D wilt'], 'Lack of water reduces turgor pressure, so the plant wilts.', '9B quick quiz 9Bb Q3', 1)
add('9B','Quick quiz','The specialised cell with a long projection for absorbing water from soil is a:','B', ['A xylem cell','B root hair cell','C root extension cell','D root palisade cell'], 'Root hair cells have long projections to increase surface area.', '9B quick quiz 9Bb Q4 - text reconstruction of drawing question', 1)
add('9B','Quick quiz','The substance used to test for starch is:','C', ['A limewater','B cobalt chloride','C iodine solution','D Benedict’s solution'], 'Iodine solution turns blue-black if starch is present.', '9B quick quiz 9Bc Q1', 1)
add('9B','Quick quiz','In which part of a plant would you expect to find the most starch?','B', ['A leaf during the night','B storage organ','C stem','D flower'], 'Storage organs such as tubers store starch.', '9B quick quiz 9Bc Q2', 2)
add('9B','Quick quiz','Glucose is used to make a polymer found in cell walls. This polymer is called:','C', ['A polyfilla','B polylose','C cellulose','D polyvinylchloride'], 'Plant cell walls contain cellulose.', '9B quick quiz 9Bc Q3', 1)
add('9B','Quick quiz','Plants use nitrate mineral salts to make:','A', ['A proteins','B lipids','C glucose','D cellulose'], 'Nitrates provide nitrogen for amino acids and proteins.', '9B quick quiz 9Bc Q4', 1)
add('9B','Quick quiz','Plants are cross-bred in order to:','C', ['A stop them becoming weeds','B stop them attacking other plants','C produce new varieties with characteristics from two different varieties','D kill them'], 'Cross-breeding combines useful inherited traits.', '9B quick quiz 9Bd Q1', 2)
add('9B','Quick quiz','Selective breeding is:','D', ['A an exciting new technology that may alter our lives','B a way of choosing winners in plant contests','C another name for sexual reproduction','D a traditional way of producing organisms with useful features'], 'Humans select parents with useful features to breed offspring.', '9B quick quiz 9Bd Q2', 2)
add('9B','Quick quiz','Plants cannot survive long without soil nutrients containing:','A', ['A potassium, phosphates, nitrates','B arsenic, mercury, thallium','C proteins, lipids, carbohydrates','D chlorophyll, oxygen, nitrogen'], 'Nitrates, phosphates and potassium compounds are important mineral nutrients.', '9B quick quiz 9Bd Q3', 1)
add('9B','Quick quiz','Herbicides are:','B', ['A used to grow plants in','B substances that kill weeds','C a type of plant used to make grains','D plants that farmers can grow in cold places'], 'Herbicides are chemicals used to kill unwanted plants.', '9B quick quiz 9Bd Q4', 1)
add('9B','Quick quiz','If insecticide is sprayed in a food web with insects eaten by wrens, what is a likely effect?','A', ['A The number of wrens would go down','B The number of wrens would go up','C The number of wrens would stay the same','D The rose bush would die'], 'Reducing insect prey can reduce wren numbers.', '9B quick quiz 9Be Q1 - text reconstruction of food-web question', 3)
add('9B','Quick quiz','An increase in which organism could control aphids?','C', ['A wrens','B aphids','C lacewings','D rose bushes'], 'Lacewings feed on aphids and can be used as biological control.', '9B quick quiz 9Be Q2', 2)
add('9B','Quick quiz','The carbon cycle:','B', ['A is a very light bicycle','B shows how carbon flows between the atmosphere and different organisms','C removes carbon dioxide to stop global warming','D is made out of oxygen and carbon'], 'The carbon cycle shows movement of carbon between stores.', '9B quick quiz 9Be Q3', 1)
add('9B','Quick quiz','Plants are important in keeping the amount of carbon in balance because:','D', ['A they make carbon','B they use up oxygen','C they release carbon dioxide','D they remove carbon dioxide from the atmosphere'], 'Photosynthesis removes carbon dioxide from the atmosphere.', '9B quick quiz 9Be Q4', 2)

# 9E
add('9E','Quick quiz','Which of the following is a ceramic material?','B', ['A steel','B glass','C cement','D polythene'], 'Glass is a ceramic material.', '9E quick quiz 9Ea Q1', 1)
add('9E','Quick quiz','Pottery and china are suitable for making tea pots because they are:','C', ['A brittle','B transparent','C heat insulators','D non-conductors of electricity'], 'Ceramics are useful for teapots because they are poor conductors of heat.', '9E quick quiz 9Ea Q2', 1)
add('9E','Quick quiz','Which statement about the formation of solid crystals is correct?','B', ['A Rapid cooling produces the largest crystals as atoms quickly form molecules','B Slow cooling produces the largest crystals as atoms have time to form a regular lattice','C Rapid cooling produces the largest crystals as it allows more bonds to form','D Slow cooling produces the largest crystals as atoms form lots of molecules'], 'Slow cooling gives particles time to arrange into larger crystals.', '9E quick quiz 9Ea Q3', 2)
add('9E','Quick quiz','A substance with a high melting point but brittle structure is best represented by:','regular giant lattice with strong bonds but planes that can crack', [], 'The original question uses diagrams. The key idea is strong bonding gives a high melting point, while a rigid lattice can be brittle.', '9E quick quiz 9Ea Q4 - diagram reconstructed as open response', 3)
add('9E','Quick quiz','Which of the following is a synthetic polymer?','D', ['A sand','B rubber','C concrete','D PVC'], 'PVC is a human-made polymer.', '9E quick quiz 9Eb Q1', 1)
add('9E','Quick quiz','A polymer is formed when:','A', ['A monomers join together in chains','B molecules break up into large atoms','C single atoms join to make monomers','D long chains break up to form molecules'], 'Polymerisation joins many monomers into long chains.', '9E quick quiz 9Eb Q2', 1)
add('9E','Quick quiz','Some polymerisation reactions are endothermic. What does this mean?','D', ['A The polymers are made by burning oil','B The formation transfers heat into the surroundings','C The polymers are made by breaking up chains','D The formation makes the surrounding temperature decrease'], 'Endothermic reactions take in energy from the surroundings.', '9E quick quiz 9Eb Q3', 2)
add('9E','Quick quiz','Vulcanisation adds cross-links in rubber. How does this change natural rubber?','C', ['A It makes the rubber softer but still easy to melt','B It makes the rubber harder and easy to melt','C It makes the rubber harder but still elastic','D It makes the rubber more flexible and easier to melt'], 'Cross-links make rubber tougher/harder while keeping elasticity.', '9E quick quiz 9Eb Q4', 2)
add('9E','Quick quiz','Which of the following is a composite material?','B', ['A glass','B plywood','C poly(styrene)','D silicon dioxide'], 'Plywood combines layers of wood, so it is a composite.', '9E quick quiz 9Ec Q1', 1)
add('9E','Quick quiz','Why is concrete described as a composite material?','C', ['A because it is made with cement','B because it sets hard and is strong','C because it combines two or more materials','D because it is made by mixing lots of different materials with water'], 'Composite materials combine materials to get useful properties.', '9E quick quiz 9Ec Q2', 1)
add('9E','Quick quiz','Glass reinforced plastic is used for building boats because it is:','A', ['A flexible and strong','B strong and brittle','C brittle and an insulator','D an insulator and transparent'], 'Glass reinforced plastic is strong and flexible enough for boat hulls.', '9E quick quiz 9Ec Q3', 2)
add('9E','Quick quiz','What happens during the decomposition of calcium carbonate to make calcium oxide?','D', ['A Heating makes two compounds join by an endothermic reaction','B Heating makes two compounds join by an exothermic reaction','C Heating breaks up the compound by an exothermic reaction','D Heating breaks up the compound by an endothermic reaction'], 'Thermal decomposition uses heat to break a compound apart.', '9E quick quiz 9Ec Q4', 2)
add('9E','Quick quiz','Which substance is thought to be one of the main greenhouse gases?','D', ['A soot','B water','C sulfur dioxide','D carbon dioxide'], 'Carbon dioxide is a major greenhouse gas.', '9E quick quiz 9Ed Q1', 1)
add('9E','Quick quiz','What is a non-biodegradable polymer?','C', ['A a polymer that breaks down when buried','B a polymer that burns in air to form carbon dioxide and water','C a polymer that does not break down when buried','D a polymer that does not burn when heated in air'], 'Non-biodegradable means it is not broken down by microorganisms.', '9E quick quiz 9Ed Q2', 1)
add('9E','Quick quiz','Why can low toxin levels released into the sea cause serious problems to humans?','B', ['A toxic materials release heat causing global warming','B toxin levels increase in larger animals up the food chain','C toxin levels in water increase as molecules react','D toxins increase acid levels in water'], 'This is biomagnification through the food chain.', '9E quick quiz 9Ed Q3', 3)
add('9E','Quick quiz','Which would help reduce the possibility of global warming?','A', ['A Burn less fossil fuels','B Remove sulfur from all fuels','C Use more biodegradable plastic bags','D Remove all toxic materials from factory waste'], 'Burning less fossil fuel reduces carbon dioxide emissions.', '9E quick quiz 9Ed Q4', 2)
add('9E','Quick quiz','How are landfill sites used to deal with waste materials?','B', ['A They burn waste to produce energy','B They spread waste on or bury it in the ground','C They sort most waste so it can be reused','D They melt waste into large solid blocks'], 'Landfill means burying or placing waste in/on the ground.', '9E quick quiz 9Ee Q1', 1)
add('9E','Quick quiz','Recycling a metal helps us use that metal further into the future because:','D', ['A recycled metals cost less','B it will not use landfill space','C recycled objects usually last longer','D recycling saves reserves of metal ores'], 'Recycling reduces the need to extract new ore.', '9E quick quiz 9Ee Q2', 2)
add('9E','Quick quiz','Which material is recycled by crushing and grading to make aggregate for foundations?','C', ['A paper','B wood','C concrete','D polythene'], 'Crushed concrete can be reused as aggregate.', '9E quick quiz 9Ee Q3', 1)
add('9E','Quick quiz','The most important reason for recycling glass is that it saves large amounts of:','C', ['A sand','B trees','C energy','D limestone'], 'Recycling glass uses less energy than making new glass.', '9E quick quiz 9Ee Q4', 2)

# 9F
add('9F','Quick quiz','Which of these describes a physical change?','B', ['A A liquid catches fire','B A liquid cools down and changes into a solid','C A solid changes colour and releases a gas when heated','D A solid fizzes when added to an acid'], 'Freezing is a change of state, not a new substance.', '9F quick quiz 9Fa Q1', 1)
add('9F','Quick quiz','Gas pressure is caused by gas particles:','C', ['A attracting each other','B hitting each other','C hitting the walls of the container','D moving around'], 'Pressure is due to particle collisions with container walls.', '9F quick quiz 9Fa Q2', 1)
add('9F','Quick quiz','The pressure of a gas increases as temperature increases because:','D', ['A there are more particles in the container','B the particles are further apart','C the particles get bigger','D the particles move faster'], 'Hotter gas particles move faster and collide harder/more often.', '9F quick quiz 9Fa Q3', 1)
add('9F','Quick quiz','In H2, what tells you that a hydrogen molecule contains 2 atoms?','B', ['A the large number 2 in front of H2','B the small number 2 after the H','C the (g) in brackets','D the formula of the product'], 'A subscript after a symbol gives the number of that atom in a molecule.', '9F quick quiz 9Fa Q4', 1)
add('9F','Quick quiz','Which salt is formed when magnesium reacts with dilute nitric acid?','C', ['A magnesium chloride','B magnesium oxide','C magnesium nitrate','D magnesium sulfate'], 'Nitric acid makes nitrate salts.', '9F quick quiz 9Fb Q1', 1)
add('9F','Quick quiz','Magnesium reacts slowly with cold water, calcium more quickly, potassium catches fire. The order of reactivity, most reactive first, is:','B', ['A magnesium, calcium, potassium','B potassium, calcium, magnesium','C calcium, magnesium, potassium','D potassium, magnesium, calcium'], 'More vigorous reaction means greater reactivity.', '9F quick quiz 9Fb Q2', 1)
add('9F','Quick quiz','The two subatomic particles found in the nucleus are:','D', ['A electrons and neutrons','B electrons and protons','C electrons and neutrons','D protons and neutrons'], 'The nucleus contains protons and neutrons.', '9F quick quiz 9Fb Q3', 1)
add('9F','Quick quiz','In the periodic table, elements are listed in order of:','B', ['A neutron number','B proton number','C electron number','D mass number'], 'Atomic number equals proton number.', '9F quick quiz 9Fb Q4', 1)
add('9F','Quick quiz','The test for oxygen is that it:','B', ['A pops a lighted splint','B relights a glowing splint','C turns cobalt chloride paper pink','D turns limewater milky'], 'Oxygen relights a glowing splint.', '9F quick quiz 9Fc Q1', 1)
add('9F','Quick quiz','Which products form when a hydrocarbon burns in plenty of air?','C', ['A carbon dioxide only','B carbon monoxide only','C carbon dioxide and water only','D carbon monoxide and water only'], 'Complete combustion forms carbon dioxide and water.', '9F quick quiz 9Fc Q2', 1)
add('9F','Quick quiz','Which reaction needs an input of energy to start it?','A', ['A hydrogen reacting with oxygen','B magnesium reacting with sulfuric acid','C sodium hydroxide reacting with hydrochloric acid','D potassium reacting with water'], 'Hydrogen and oxygen need a spark/flame to start.', '9F quick quiz 9Fc Q3', 2)
add('9F','Quick quiz','An exothermic reaction is one in which:','A', ['A energy is transferred to the surroundings','B energy is transferred from the surroundings','C a supply of energy is needed to start the reaction','D the temperature of the surroundings drops'], 'Exothermic reactions release energy to the surroundings.', '9F quick quiz 9Fc Q4', 1)
add('9F','Quick quiz','Which of these is a displacement reaction?','B', ['A magnesium + oxygen -> magnesium oxide','B zinc + iron oxide -> zinc oxide + iron','C copper carbonate -> copper oxide + carbon dioxide','D hydrogen + oxygen -> water'], 'A more reactive metal displaces a less reactive metal from its compound.', '9F quick quiz 9Fd Q1', 2)
add('9F','Quick quiz','What is seen when magnesium reacts fully with copper sulfate solution?','B', ['A brown solid and blue solution','B brown solid and colourless solution','C grey solid and blue solution','D grey solid and colourless solution'], 'Copper metal forms as a brown solid; magnesium sulfate solution is colourless.', '9F quick quiz 9Fd Q2', 3)
add('9F','Quick quiz','Given Z displaces X, Y displaces X, and Y displaces Z, what is the reactivity order, most reactive first?','D', ['A Z, Y, X','B Z, X, Y','C Y, X, Z','D Y, Z, X'], 'If a metal displaces another, it is more reactive. Y displaces Z and X; Z displaces X.', '9F quick quiz 9Fd Q3', 3)
add('9F','Quick quiz','Aluminium reacts with iron oxide to form aluminium oxide and iron. Which is correct?','C', ['A Iron displaced aluminium oxide','B Aluminium oxide displaced iron','C Aluminium displaced iron','D Iron displaced aluminium'], 'Aluminium is more reactive and displaces iron from iron oxide.', '9F quick quiz 9Fd Q4', 2)
add('9F','Quick quiz','Metals are usually extracted from:','A', ['A minerals found in ores','B minerals found in orbits','C elements found in the Earth’s crust','D ores found in minerals'], 'Ores are rocks containing useful minerals from which metals can be extracted.', '9F quick quiz 9Fe Q1', 1)
add('9F','Quick quiz','Which metal was first extracted most recently in history?','A', ['A aluminium','B copper','C gold','D iron'], 'Aluminium extraction needed electrolysis, so it came much later.', '9F quick quiz 9Fe Q2', 2)
add('9F','Quick quiz','What is reduced in: zinc oxide + carbon -> zinc + carbon dioxide?','D', ['A carbon','B carbon dioxide','C zinc','D zinc oxide'], 'Zinc oxide loses oxygen, so it is reduced.', '9F quick quiz 9Fe Q3', 2)
add('9F','Quick quiz','Which metal can only be extracted using electrolysis?','C', ['A copper','B lead','C potassium','D silver'], 'Very reactive metals such as potassium require electrolysis.', '9F quick quiz 9Fe Q4', 2)

# 9I
add('9I','Quick quiz','For a falling object, which labels best match the forces: weight downward and air resistance upward?','C', ['A X is air resistance, Y is gravity','B X is air resistance, Y is friction','C X is weight, Y is air resistance','D X is friction, Y is air resistance'], 'Weight acts downwards; air resistance acts upwards against motion.', '9I quick quiz 9Ia Q1 - diagram reconstructed', 1)
add('9I','Quick quiz','Balanced forces:','C', ['A make objects speed up','B make objects slow down','C do not change the speed of moving objects','D only affect stationary objects'], 'Balanced forces produce no resultant force, so motion does not change.', '9I quick quiz 9Ia Q2', 1)
add('9I','Quick quiz','A boat has a forwards force of 500 N and water resistance of 400 N. Which statement is true?','C', ['A The forces are balanced and the boat will go faster','B The forces are balanced and the boat continues at the same speed','C The forces are unbalanced and the boat will go faster','D The forces are unbalanced and the boat continues at the same speed'], 'There is a 100 N resultant forwards force, so the boat accelerates.', '9I quick quiz 9Ia Q3', 2)
add('9I','Quick quiz','All vehicles have a top speed. This is when:','B', ['A air resistance is the same as force from the engine','B drag and friction forces balance the maximum force from the engine','C force from engine balances friction in the wheels','D drag forces balance friction forces'], 'At top speed the driving force is balanced by all resistive forces.', '9I quick quiz 9Ia Q4', 2)
add('9I','Quick quiz','Which of these is not a way in which energy is stored?','C', ['A chemical','B kinetic','C electrical','D thermal'], 'Electrical is usually an energy transfer pathway, not an energy store.', '9I quick quiz 9Ib Q1', 1)
add('9I','Quick quiz','Which of these is a way in which energy can be transferred?','C', ['A movement','B petrol','C light','D potential'], 'Light is a radiation transfer pathway.', '9I quick quiz 9Ib Q2', 1)
add('9I','Quick quiz','In which ways is energy most often transferred as wasted energy?','B', ['A heating and light','B heating and sound','C sound and light','D sound and kinetic'], 'Wasted energy is often dissipated by heating and sound.', '9I quick quiz 9Ib Q3', 1)
add('9I','Quick quiz','Which machine is more efficient in a Sankey diagram?','A', ['A Y because it does not waste as much energy as X','B Y because it wastes more energy than X','C X because it transfers the most energy','D X because it wastes more energy than Y'], 'The more efficient machine wastes a smaller proportion of input energy.', '9I quick quiz 9Ib Q4 - diagram reconstructed', 3)
add('9I','Quick quiz','The speed of a car is a measure of how:','B', ['A far it is travelling','B fast it is travelling','C long it is travelling','D high it is travelling'], 'Speed describes how fast something moves.', '9I quick quiz 9Ic Q1', 1)
add('9I','Quick quiz','A bus travelled 20 km in 2 hours. Its speed was:','D', ['A 0.1 km/h','B 40 km/h','C 20 km/h','D 10 km/h'], 'Speed = distance / time = 20 / 2 = 10 km/h.', '9I quick quiz 9Ic Q2', 2)
add('9I','Quick quiz','The mean speed of something is:','B', ['A its fastest speed','B total distance travelled divided by time taken','C its slowest speed','D its speed limit'], 'Mean speed = total distance / total time.', '9I quick quiz 9Ic Q3', 1)
add('9I','Quick quiz','On a distance-time graph, which section shows where a car has stopped?','B', ['A a steep upward section','B a horizontal flat section','C a downward section','D the final point only'], 'A horizontal section shows time passing with no change in distance.', '9I quick quiz 9Ic Q4 - graph reconstructed', 2)
add('9I','Quick quiz','For a lever, the pivot is also called the:','fulcrum', [], 'The pivot or fulcrum is the point around which a lever turns.', '9I quick quiz 9Id Q1 - diagram reconstructed as open response', 1)
add('9I','Quick quiz','Which lever makes it easiest to move a heavy rock?','the lever with the longest effort arm and the shortest load arm', [], 'A longer distance from effort to pivot gives a larger moment for the same force.', '9I quick quiz 9Id Q2 - diagram reconstructed as open response', 3)
add('9I','Quick quiz','You open a paint can with a screwdriver. You apply 10 N at 0.2 m from the pivot. What is the moment?','A', ['A 2 N m','B 20 N m','C 200 N m','D 2000 N m'], 'Moment = force × perpendicular distance = 10 × 0.2 = 2 N m.', '9I quick quiz 9Id Q3', 2)
add('9I','Quick quiz','A seesaw is balanced. Boy: 300 N × ? m. Girl: 450 N × 2 m. What is the distance from pivot to boy?','C', ['A 1 m','B 2 m','C 3 m','D 4 m'], 'For balance: 300 × d = 450 × 2, so d = 3 m.', '9I quick quiz 9Id Q4', 3)
add('9I','Quick quiz','Which of these is not a simple machine?','B', ['A lever','B bicycle','C ramp','D pulley'], 'A bicycle uses simple machines but is not itself one of the basic simple machines here.', '9I quick quiz 9Ie Q1', 1)
add('9I','Quick quiz','Which statement is true?','B', ['A A ramp can be a force multiplier or a distance multiplier','B A machine can make it possible to move a load using a smaller force','C A machine makes it possible to move an object with less work','D Shallow ramps make it harder to lift loads than steep ones'], 'Machines can reduce force by increasing distance moved.', '9I quick quiz 9Ie Q2', 2)
add('9I','Quick quiz','A pulley lets you lift 100 N using 50 N. How is energy conserved?','A', ['A The rope is pulled for double the distance that the weight moves','B The rope is pulled by the same distance','C The rope is pulled only half the distance','D There is not much friction'], 'If force halves, distance roughly doubles, so work is conserved.', '9I quick quiz 9Ie Q3', 3)
add('9I','Quick quiz','A girl pushes a wheelbarrow 2 m with a force of 30 N. How much work did she do?','D', ['A 15 N','B 15 J','C 30 J','D 60 J'], 'Work done = force × distance = 30 × 2 = 60 J.', '9I quick quiz 9Ie Q4', 2)

# 9J
add('9J','Quick quiz','The direction of a magnetic field is from:','B', ['A the south pole to the north pole','B the north pole to the south pole','C the west pole to the east pole','D the east pole to the west pole'], 'Magnetic field lines go from north to south outside the magnet.', '9J quick quiz 9Ja Q1', 1)
add('9J','Quick quiz','An object’s weight:','A', ['A is caused because it is pulled towards the Earth','B is caused by the Earth’s magnetic field','C is caused by air pushing down on it','D stays the same even if mass changes'], 'Weight is the force of gravity on mass.', '9J quick quiz 9Ja Q2', 1)
add('9J','Quick quiz','Gravity is less on the Moon than on Earth because:','D', ['A the Moon is smaller than Earth','B the Moon has a bigger mass than Earth','C the Moon is bigger than Earth','D the Moon has less mass than Earth'], 'Lower mass gives a weaker gravitational field.', '9J quick quiz 9Ja Q3', 2)
add('9J','Quick quiz','Which object has the greatest store of gravitational potential energy?','C', ['A 1 kg mass 10 m above the floor','B 10 kg mass 1 m above the floor','C 10 kg mass 10 m above the floor','D 1 kg mass 1 m above the floor'], 'GPE increases with both mass and height.', '9J quick quiz 9Ja Q4', 2)
add('9J','Quick quiz','Which statement about atoms is not true?','C', ['A The nucleus is in the centre','B Electrons have negative charge','C An atom usually has more negative charges than positive charges','D The nucleus has a positive charge'], 'Atoms are usually neutral, with equal positive and negative charges.', '9J quick quiz 9Jb Q1', 1)
add('9J','Quick quiz','An object has a negative charge. Which statement is correct?','A', ['A Electrons have been transferred onto it','B Electrons have been transferred away from it','C It has more positive than negative charges','D Positive charges have been transferred away from it'], 'A negative charge means extra electrons.', '9J quick quiz 9Jb Q2', 1)
add('9J','Quick quiz','Why can we not detect static charge if we rub a metal rod?','B', ['A Metal objects cannot be charged','B The charge spreads out over the whole object','C Metals do not contain transferable electrons','D Electrons cannot move through metals'], 'Metals conduct, so charge spreads away instead of staying localised.', '9J quick quiz 9Jb Q3', 2)
add('9J','Quick quiz','An electric field is the space around a charged object where it:','C', ['A attracts a magnet','B attracts other charges','C can attract or repel other charges','D transfers electrons'], 'Electric fields exert forces on charges; like charges repel and unlike charges attract.', '9J quick quiz 9Jb Q4', 1)
add('9J','Quick quiz','Which is the best description of electric current?','B', ['A A flow of positively charged particles called electrons','B A flow of negatively charged particles called electrons','C The number of amps in a circuit','D Something that a cell pushes around a circuit'], 'In metal wires, current is a flow of electrons.', '9J quick quiz 9Jc Q1', 1)
add('9J','Quick quiz','Voltage is:','C', ['A another name for current','B a way of counting cells','C a way of saying how much energy the electricity is carrying','D something that makes it difficult for electricity to flow'], 'Voltage tells us about energy transferred by charge/current.', '9J quick quiz 9Jc Q2', 1)
add('9J','Quick quiz','Which statement is not true for a series circuit?','A', ['A The voltage is always the same for all components','B The voltage across each component depends on energy used','C The voltages add up to the voltage across the cell','D Voltage can be measured using a voltmeter'], 'In series, current is the same, but voltage is shared between components.', '9J quick quiz 9Jc Q3', 2)
add('9J','Quick quiz','Which statement is true for a parallel circuit?','B', ['A The current is the same in every branch','B The voltage is the same across every branch','C Voltage is divided between branches','D Current through branches is greater than current through the cell'], 'In parallel, each branch has the same voltage as the supply.', '9J quick quiz 9Jc Q4', 2)
add('9J','Quick quiz','Which statement is correct?','A', ['A Insulating materials have very high resistances','B Conducting materials have very high resistances','C Insulating materials have very low resistances','D Connecting wires have no resistance'], 'Insulators resist current flow strongly.', '9J quick quiz 9Jd Q1', 1)
add('9J','Quick quiz','Which copper wire has the highest resistance?','B', ['A 0.5 mm diameter, 10 cm long','B 0.5 mm diameter, 20 cm long','C 1.0 mm diameter, 10 cm long','D 1.0 mm diameter, 20 cm long'], 'Resistance is higher for thinner and longer wires.', '9J quick quiz 9Jd Q2', 2)
add('9J','Quick quiz','The units for measuring resistance are:','B', ['A amps','B ohms','C volts','D joules'], 'Resistance is measured in ohms, symbol Ω.', '9J quick quiz 9Jd Q3', 1)
add('9J','Quick quiz','What is the formula for calculating resistance?','C', ['A resistance = voltage × current','B resistance = current / voltage','C resistance = voltage / current','D ohms = volts × amps'], 'R = V / I.', '9J quick quiz 9Jd Q4', 2)
add('9J','Quick quiz','Which change will make an electromagnet stronger?','A', ['A use more coils of wire','B use a smaller current','C use a wooden core','D use fewer coils of wire'], 'More coils increase the magnetic field strength.', '9J quick quiz 9Je Q1', 1)
add('9J','Quick quiz','Why are relays useful?','C', ['A They allow a large current to be switched on by a high-current circuit','B They allow a small current to be switched on by a high-current circuit','C They allow a large current to be switched on by a low-current circuit','D They allow a small current to be switched on by a low-current circuit'], 'A small current can control an electromagnet that switches a larger current.', '9J quick quiz 9Je Q2', 2)
add('9J','Quick quiz','A wire carrying a current in a magnetic field experiences a force. How can the force be made stronger?','D', ['A swap the magnets over','B change the direction of the current','C use weaker magnets','D increase the size of the current'], 'Increasing current increases the motor-effect force.', '9J quick quiz 9Je Q3', 2)
add('9J','Quick quiz','Which list shows the parts of an electric motor?','B', ['A bar magnet, coil of wire, pivot','B two magnets, coil of wire, pivot, cell','C bar magnet, straight wire, electromagnet','D two magnets, straight wire, cell'], 'A simple motor needs magnets, a coil, a pivot/axle and a power supply.', '9J quick quiz 9Je Q4', 2)

# ---------------------------------------------------------------------------
# Vocabulary cards from word sheets and summary sheets.
# ---------------------------------------------------------------------------
vocab = {
'9A': [
('species','A group of organisms that can reproduce with each other to produce fertile offspring.'),
('genus','A group of closely related species. It is the first word in a scientific name.'),
('variation','Differences between organisms or things.'),
('characteristic','A feature of an organism.'),
('classification','Sorting living things into groups.'),
('environmental variation','Differences caused by environmental factors.'),
('inherited variation','Differences passed from parents to offspring through genetic information.'),
('continuous variation','Variation where values can take any value in a range, such as height or mass.'),
('discontinuous variation','Variation with separate categories, such as blood group.'),
('gamete','A sex cell used in sexual reproduction.'),
('fertilisation','Fusion of a male gamete with a female gamete.'),
('zygote','A fertilised egg cell.'),
('gene','A section of DNA that contains instructions for a characteristic.'),
('chromosome','A structure in the nucleus made from a long DNA molecule.'),
('DNA','The molecule that carries genetic information.'),
('normal distribution','A bell-shaped pattern where middle values are most common.'),
('adaptation','A feature that helps an organism survive in its environment.'),
('biodiversity','The variety of living organisms in an area or on Earth.'),
('conservation','Protecting organisms and habitats to preserve biodiversity.'),
('natural selection','Process where better-adapted organisms are more likely to survive and reproduce.'),
('evolution','Gradual change in inherited characteristics of a population over time.'),
],
'9B': [
('photosynthesis','The process by which plants use light energy to make glucose from carbon dioxide and water.'),
('chlorophyll','Green substance in chloroplasts that absorbs light energy.'),
('limiting factor','A factor that slows a reaction if there is not enough of it.'),
('aerobic respiration','Chemical reactions that release energy from glucose using oxygen.'),
('phloem','Plant vessels that transport dissolved sugars around the plant.'),
('xylem','Plant vessels that transport water and mineral salts from roots to leaves.'),
('root hair cell','A specialised root cell with a large surface area for absorbing water and minerals.'),
('stomata','Small pores in leaves that allow gas exchange.'),
('guard cells','Cells that open and close stomata.'),
('starch','A storage carbohydrate made from glucose.'),
('iodine test','A test for starch; iodine turns blue-black if starch is present.'),
('cellulose','A polymer made from glucose that strengthens plant cell walls.'),
('nitrate','A mineral salt plants use to make amino acids and proteins.'),
('selective breeding','Choosing parents with useful characteristics to produce offspring with those traits.'),
('herbicide','A chemical used to kill weeds.'),
('insecticide','A chemical used to kill insect pests.'),
('biological control','Using living organisms to control pests.'),
('carbon cycle','Movement of carbon between organisms, the atmosphere, oceans and rocks.'),
],
'9E': [
('ceramic','A hard, usually heat-resistant material such as glass, pottery or brick.'),
('brittle','Hard but easily broken or cracked.'),
('bond','A force that holds atoms or particles together.'),
('lattice','A regular repeating arrangement of particles.'),
('polymer','A long-chain molecule made from many monomers.'),
('monomer','A small molecule that can join with others to form a polymer.'),
('synthetic polymer','A human-made polymer such as PVC or poly(ethene).'),
('vulcanisation','Adding cross-links to rubber to make it harder and more useful while still elastic.'),
('composite','A material made from two or more materials combined for useful properties.'),
('concrete','A composite made using cement, aggregate and water.'),
('glass reinforced plastic','A composite made from glass fibres in a plastic matrix.'),
('thermal decomposition','Breaking a compound apart by heating it.'),
('greenhouse gas','A gas that helps trap heat in the atmosphere, such as carbon dioxide.'),
('biomagnification','Increase in toxin concentration up a food chain.'),
('biodegradable','Able to be broken down by microorganisms.'),
('non-biodegradable','Not easily broken down by microorganisms.'),
('landfill','Disposal of waste by burying or placing it in the ground.'),
('recycling','Processing waste materials so they can be used again.'),
],
'9F': [
('physical change','A change where no new substance is made.'),
('chemical reaction','A change where new substances are made.'),
('gas pressure','Pressure caused by gas particles colliding with container walls.'),
('reactivity','How easily a substance reacts chemically.'),
('periodic table','Arrangement of elements in order of proton number.'),
('proton','A positive particle in the nucleus of an atom.'),
('neutron','A neutral particle in the nucleus of an atom.'),
('electron','A negative particle outside the nucleus.'),
('salt','A compound formed when the hydrogen in an acid is replaced by a metal or ammonium ion.'),
('combustion','Burning, usually a reaction with oxygen.'),
('hydrocarbon','A compound containing hydrogen and carbon only.'),
('exothermic reaction','A reaction that transfers energy to the surroundings.'),
('endothermic reaction','A reaction that takes in energy from the surroundings.'),
('displacement reaction','A reaction where a more reactive element takes the place of a less reactive one.'),
('oxidation','Gain of oxygen, or loss of electrons.'),
('reduction','Loss of oxygen, or gain of electrons.'),
('ore','A rock containing enough useful metal compound to extract profitably.'),
('electrolysis','Using electricity to split an ionic compound.'),
],
'9I': [
('balanced forces','Forces that are equal in size and opposite in direction, causing no change in motion.'),
('resultant force','The overall force when all forces on an object are combined.'),
('air resistance','A force that slows objects moving through air.'),
('terminal velocity','The maximum steady speed reached when weight and air resistance are balanced.'),
('energy store','A way energy can be stored, such as chemical, kinetic or thermal.'),
('energy transfer','Movement of energy from one store or object to another.'),
('efficiency','The useful energy output divided by total energy input.'),
('speed','Distance travelled per unit time.'),
('mean speed','Total distance divided by total time.'),
('distance-time graph','A graph showing how distance changes over time.'),
('lever','A simple machine that turns about a pivot.'),
('pivot','The point about which a lever turns.'),
('moment','Turning effect of a force; force multiplied by perpendicular distance from pivot.'),
('simple machine','A device such as a lever, pulley or ramp that makes work easier by changing force or distance.'),
('work done','Energy transferred when a force moves an object through a distance.'),
],
'9J': [
('force field','A volume around something where a non-contact force can affect things.'),
('magnetic field','The space around a magnet where magnetic materials or magnets are affected.'),
('gravitational field','The space around a mass where it attracts other masses.'),
('gravitational field strength','Force per kilogram in a gravitational field; on Earth about 10 N/kg.'),
('weight','The force of gravity on an object, measured in newtons.'),
('mass','The amount of matter in an object, measured in kg or g.'),
('gravitational potential energy','Energy stored by an object because of its height in a gravitational field.'),
('electric field','The space around a charged object where other charges feel a force.'),
('static electricity','A build-up of electric charge, often caused by rubbing insulators.'),
('electric current','A flow of electrons around a circuit.'),
('series circuit','A circuit with one loop and one path for current.'),
('parallel circuit','A circuit with branches that split and rejoin.'),
('voltage','A measure of energy transferred by electricity.'),
('resistance','How difficult it is for current to flow through something.'),
('ohm','The unit for resistance, symbol Ω.'),
('electromagnet','A coil of wire that becomes magnetic when current flows.'),
('relay','A switch operated by an electromagnet, often using a small current to control a larger current.'),
('motor effect','The force on a current-carrying wire in a magnetic field.'),
],
}
for unit, pairs in vocab.items():
    for term, meaning in pairs:
        add(unit, 'Vocabulary', f'Define: {term}', meaning, [], f'{term}: {meaning}', f'{unit} word sheet / summary sheet', 1 if len(meaning)<90 else 2, cue='Say the definition in your own words first.', tags=['vocabulary'])

# ---------------------------------------------------------------------------
# Progression checks, revision worksheet prompts and assess-yourself tasks.
# ---------------------------------------------------------------------------
progress = [
('9A','Describe what environmental variation is.','Environmental variation is variation caused by conditions in the environment, such as light, diet, exercise, disease or climate.','9A revision worksheet',2),
('9A','Give three examples of environmental variation in plants.','Examples include height affected by light, leaf size affected by water, and growth affected by mineral supply.','9A revision worksheet',2),
('9A','Give three examples of environmental variation in humans.','Examples include suntan, scars, language spoken, or fitness affected by training.','9A revision worksheet',2),
('9A','Define classification.','Classification is sorting organisms into groups based on similarities and differences.','9A revision worksheet',1),
('9A','Define species.','A species is a group of organisms that can reproduce to produce fertile offspring.','9A revision worksheet',1),
('9A','Explain how environmental variation can cause problems with classification.','Environmental factors can make organisms of the same species look different, so appearance alone may not show true relationships.','9A revision worksheet',3),
('9A','Describe what happens during fertilisation and what is formed.','A male gamete fuses with a female gamete. Their nuclei combine and a zygote is formed.','9A revision worksheet',2),
('9A','Describe how chromosomes, DNA and genes are linked together.','Chromosomes are found in the nucleus and are made from DNA. Genes are short sections of DNA that code for characteristics.','9A revision worksheet',3),
('9A','State three ways we can preserve biodiversity.','Possible ways include nature reserves, captive breeding, seed/gene banks, habitat protection, and banning trade in endangered organisms.','9A revision worksheet',2),
('9A','Describe natural selection.','Individuals vary genetically; those with useful adaptations survive and reproduce more, passing useful genes to offspring.','9A revision worksheet',4),
('9B','State where a plant gets the reactants it needs for photosynthesis.','Carbon dioxide enters from the air through stomata; water is absorbed by roots; light comes from the Sun or lamp.','9B Plant Growth PPT progress check slide 14',2),
('9B','Describe what happens to the products of photosynthesis.','Oxygen may diffuse out of the leaf; glucose can be used in respiration or converted to starch, cellulose, lipids or proteins.','9B Plant Growth PPT progress check slide 14',3),
('9B','Describe what a limiting factor is.','A limiting factor is a factor that slows the rate of a reaction when there is not enough of it.','9B Plant Growth PPT progress check slide 14',2),
('9B','Suggest when photosynthesis might occur in plants.','Photosynthesis occurs when light is available and the plant has carbon dioxide, water and chlorophyll.','9B Plant Growth PPT progress check slide 14',2),
('9B','Describe the route water takes from soil to a leaf.','Water is absorbed by root hair cells, passes into root tissues, travels up xylem vessels, and enters leaf cells.','9B Plant Growth PPT progress check slide 43',3),
('9B','Explain the structure of xylem vessels.','Xylem vessels are hollow tubes made from dead cells, strengthened to carry water and mineral ions up the plant.','9B Plant Growth PPT progress check slide 43',3),
('9B','State the cells that control gas exchange in leaves.','Guard cells control the opening and closing of stomata.','9B Plant Growth PPT progress check slide 48',2),
('9B','Suggest why stomata shut at night.','At night photosynthesis stops, so stomata can close to reduce water loss while gas exchange demand is lower.','9B Plant Growth PPT progress check slide 48',3),
('9B','Draw or describe the relationship between glucose and starch.','Many glucose molecules join together to form starch, a storage carbohydrate. Starch can be broken back down into smaller sugars.','9B Plant Growth PPT progress check slide 62',3),
('9B','Suggest why seeds need starch.','Seeds need starch as an energy store. During germination it is digested to glucose for respiration and growth.','9B Plant Growth PPT progress check slide 62',3),
('9E','Design-poster prompt: list what a Year 9 poster on ceramics, polymers and composites should include.','It should include examples, properties, uses, links between properties and structure/bonding, environmental problems, and recycling/disposal options.','9E assess yourself',5),
('9E','Explain how properties of ceramics link to bonding and structure.','Strong bonds in a rigid lattice give high melting points and hardness, but the structure can be brittle when layers crack or defects spread.','9E assess yourself',4),
('9E','Explain why composites often have better properties than their separate materials.','A composite combines materials so one provides strength or stiffness while another binds, protects or adds flexibility.','9E assess yourself',3),
('9E','Explain one environmental problem caused by making materials.','Making materials can burn fossil fuels, releasing carbon dioxide; some processes also release toxins or sulfur dioxide.','9E summary sheet / assess yourself',3),
('9F','Prepare a talk: what should be included on extracting iron and preventing rusting?','Include mining iron ore, blast furnace extraction, why carbon is used, properties/uses of iron and steel, rusting conditions, and rust-prevention methods.','9F assess yourself',5),
('9F','Why is a metal oxide reduced when carbon extracts a metal?','The metal oxide loses oxygen to carbon, forming the metal and carbon dioxide or carbon monoxide.','9F summary sheet / assess yourself',3),
('9F','Explain why aluminium is extracted by electrolysis rather than carbon reduction.','Aluminium is more reactive than carbon, so carbon cannot displace it from its oxide; electrolysis is needed.','9F quick quiz / summary sheet',3),
('9F','Explain why rusting is a problem and name two prevention methods.','Rust weakens iron/steel. Prevention methods include painting, oiling/greasing, galvanising, coating with plastic, or sacrificial protection.','9F assess yourself',3),
('9I','Describe how to raise a large upright stone using levers, moments and ramps.','Use levers to create a larger turning moment, move the stone gradually, and use ramps to reduce the force needed by increasing the distance moved.','9I assess yourself',5),
('9I','Explain why a shallow ramp needs less force but more distance.','The same work is spread over a longer distance, so a smaller force is needed, ignoring friction.','9I assess yourself / simple machines',3),
('9I','Calculate the weight of a 54 kg person on Earth where g = 10 N/kg.','Weight = mass × g = 54 × 10 = 540 N.','9Ja Force Fields PPT Guardians calculation',2),
('9I','A 96 kg person is on a planet where g = 14 N/kg. Calculate weight.','Weight = mass × g = 96 × 14 = 1344 N.','9Ja Force Fields PPT Guardians calculation',3),
('9I','A person weighs 1220 N on Earth where g = 10 N/kg. Calculate mass.','Mass = weight / g = 1220 / 10 = 122 kg.','9Ja Force Fields PPT Guardians calculation',3),
('9J','Describe what an electromagnet is and how its magnetic field is shaped.','An electromagnet is a coil of wire with current flowing. Its field is like a bar magnet, with north and south poles.','9Je Electromagnets PPT',2),
('9J','How can the strength of an electromagnet be increased?','Increase the current, increase the number of coils, or use an iron core.','9Je Electromagnets PPT',2),
('9J','Explain how a relay works.','A small current switches on an electromagnet. The electromagnet pulls contacts together to switch on a separate circuit, often with a larger current.','9Je Electromagnets PPT / word sheet',4),
('9J','Describe the difference between current and voltage.','Current is the flow of electrons around a circuit. Voltage is a measure of the energy transferred by the current.','9Jc Current Electricity PPT',2),
('9J','Explain why plastic handles are safe on electrical wires.','Plastic has very high resistance and is an insulator, so current cannot easily flow through it to your body.','9Jd Resistance PPT progress check',3),
('9J','Describe how to test whether resistance depends on wire length.','Use wires of the same material and thickness but different lengths; measure current and voltage for each and calculate resistance.','9Jd Resistance PPT exam-style question',4),
]
for unit, question, answer, source, level in progress:
    add(unit, 'Progress check', question, answer, [], answer, source, level, cue='Try to answer in full sentences before revealing the mark-scheme version.', tags=['written'])

# Add several calculation cards using formulas from 9I/9J
calcs = [
('9J','Calculate weight: mass = 34 kg and gravitational field strength = 6.8 N/kg.','231.2 N','Weight = mass × g = 34 × 6.8 = 231.2 N.','9Ja Force Fields PPT Guardians calculation',3),
('9J','A person has weight 686 N and mass 56 kg. Calculate gravitational field strength.','12.25 N/kg','g = weight / mass = 686 / 56 = 12.25 N/kg.','9Ja Force Fields PPT Guardians calculation',4),
('9J','A component has voltage 10 V and current 0.5 A. Calculate resistance.','20 Ω','R = V / I = 10 / 0.5 = 20 Ω.','9Jd Resistance PPT modelled answer',2),
('9J','A resistor has voltage 6 V and current 0.2 A. Calculate resistance.','30 Ω','R = V / I = 6 / 0.2 = 30 Ω.','9Jd Resistance formula practice',2),
('9I','A cyclist travels 12 km in 0.5 h. Calculate mean speed.','24 km/h','Speed = distance / time = 12 / 0.5 = 24 km/h.','9I speed summary / quick quiz style',2),
('9I','A force of 40 N moves a box 3 m. Calculate work done.','120 J','Work done = force × distance = 40 × 3 = 120 J.','9I simple machines / work done',2),
('9I','A 5 N force acts 0.4 m from a pivot. Calculate the moment.','2 N m','Moment = force × distance = 5 × 0.4 = 2 N m.','9I moments quick quiz style',2),
]
for unit, q, a, exp, src, lvl in calcs:
    add(unit, 'Calculation', q, a, [], exp, src, lvl, cue='Write the formula, substitute numbers, then add units.', tags=['calculation'])

content = {
    "version":"1.0.0",
    "title":"Year 9 Science End-of-Year Study",
    "subtitle":"Quick quizzes, progression checks, vocabulary and boss-mode tests",
    "units": units,
    "cards": cards,
    "notes": [
        "Quick-quiz cards are reconstructed from the provided Year 9 PDFs.",
        "Diagram-only questions were converted into text prompts where the original image was not carried into the static app.",
        "Use only where the source-pack licence permits classroom/institution copying."
    ]
}

out = Path(__file__).resolve().parents[1] / 'data' / 'year9-content.js'
out.write_text('window.YEAR9_CONTENT = ' + json.dumps(content, indent=2, ensure_ascii=False) + ';\n', encoding='utf-8')
print(f'Wrote {out} with {len(cards)} cards')
from collections import Counter
print('By unit', Counter(c['unit'] for c in cards))
print('By type', Counter(c['type'] for c in cards))
print('By level', Counter(c['level'] for c in cards))
