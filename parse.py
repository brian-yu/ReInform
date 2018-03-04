

file = open("coords.txt")
out = open("centers.json", "w+")
out.write("{")
for line in file:
	a = line.rstrip().split(":")
	print(a)
	name = a[0]
	lat, lon = a[1].split(" ")
	out.write("\"{}\": [-{}, {}],\n".format(name, lon, lat))
out.write("}")