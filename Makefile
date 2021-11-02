build:
	make build -C frontend
	make build -C backend

clean:
	rm -rf dist
	rm -f jiffer.tar.gz
	make clean -C frontend
	make clean -C backend

install:
	make install -C frontend
	make install -C backend

package:
	# Create a clean new build
	make clean install
	# Copy backend files
	cp -r backend/dist dist
	cp backend/package.json dist/
	cp backend/package-lock.json dist/
	cp backend/ecosystem.config.js dist/
	# Copy frontend to the static folder
	cp -r frontend/dist/frontend dist/static
	# On Linux systems create a .tar.gz
	bsdtar -a -cf jiffer.tar.gz -C dist .

