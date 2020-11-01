# 3d-cgan-display

### Setup steps for server

```powershell
# using powershell to run the following script
cd 3d-cgan-display

# install deps
.\script\install-deps.ps1

# enter server directory
cd src\server

# start dev server
.\dev.ps1
```

### Setup client development environment

```shell
cd 3d-cgan-display/src/client

# using taobao npm mirror
nrm use taobao

# install deps
npm i

# start webpack-dev-server
npm start
```

## License

MIT License

