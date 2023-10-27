# Maintainer: Allan Niles <allancoding.dev@gmail.com>
pkgname=flashplayer
pkgver=1.0
pkgrel=1
pkgdesc="This is a Flash Player that works past 2020!"
arch=('any')
url="https://github.com/allancoding/flashplayer"
license=('AGPL-3.0')
depends=('electron')
source=("git+https://github.com/yourusername/your-repo.git#tag=v${pkgver}")
md5sums=('SKIP')
build() {
    cd "$srcdir/flashplayer"
    npm install
}

package() {
    cd "$srcdir/your-repo"  # Adjust the directory name according to your repo
    install -Dm755 my-electron-app "$pkgdir/usr/bin/my-electron-app"  # Install your app to the system
}
