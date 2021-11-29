docker-build:
	docker build -t realworld-react-kenet .

docker-run: docker-build
	docker run --name realworld-react-kenet --rm -it -p 8080:5000 realworld-react-kenet

docker-bash: docker-build
	docker run --name realworld-react-kenet --rm -it realworld-react-kenet bash
