
def secrets = [
    [path: 'servers/tools_server', engineVersion: 1, secretValues: [
        [envVar: 'HOSTNAME', vaultKey: 'hostname'],
        [envVar: 'PASSWORD', vaultKey: 'password'],
        [envVar: 'USERNAME', vaultKey: 'username']]],

    [path: 'ci-tools/nexus', engineVersion: 1, secretValues: [
        [envVar: 'NEXUS_USERNAME', vaultKey: 'username'],
        [envVar: 'NEXUS_PASSWORD', vaultKey: 'password'],
        [envVar: 'NEXUS_REGISTRY', vaultKey: 'nexus_registry'],
        [envVar: 'NEXUS_URL', vaultKey: 'nexus_url']]],
]

def vaultConfig = [
    vaultUrl: 'http://vault:8200',
    vaultCredentialId: 'vault-jenkins-role',
    engineVersion: 1
]

pipeline {
  agent any

  stages {

/*   stage('Sonar Scann code') {
      steps{
        mavenSonarScan()
      }
    }
*/
    stage('Define Variables and Read POM') {
      steps {
        withVault(configuration: vaultConfig, vaultSecrets: secrets) {
          script {

            env.ARTEFACT_ID = "multiflex-webapp"
            env.PROJET_VERSION = "latest"

            env.REGISTRY_USERNAME = "$NEXUS_USERNAME"
            env.REGISTRY_PASSWORD = "$NEXUS_PASSWORD"
            env.NEXUS_URL = "$NEXUS_URL"
            env.REGISTRY_URL = "$NEXUS_REGISTRY"
            env.IMAGE_NAME = "${env.REGISTRY_URL}/${env.ARTEFACT_ID}"
            env.IMAGE_TAG = "${env.PROJET_VERSION}"
            env.IMAGE_FULL = "${env.IMAGE_NAME}:${env.IMAGE_TAG}"
            env.IMAGE_RELEASE = "${env.IMAGE_NAME}:release"
          }
        }
      }
    }

    stage('Build & Tag Docker Image') {
      steps {
        script {
          sh """
            docker build \
            --build-arg NEXUS_USERNAME=${env.REGISTRY_USERNAME} \
            --build-arg NEXUS_PASSWORD=${env.REGISTRY_PASSWORD} \
            -t ${env.IMAGE_NAME} .

            docker tag ${env.IMAGE_NAME} ${env.IMAGE_FULL}
          """
        }
      }
    }

    stage('Push Docker Image') {
      steps {
        withVault(configuration: vaultConfig, vaultSecrets: secrets) {
          script {
            sh """
              docker login ${env.REGISTRY_URL} -u ${env.REGISTRY_USERNAME} -p ${env.REGISTRY_PASSWORD}
              docker push ${env.IMAGE_FULL}
            """
          }
        }    
      }
    }
  }
}
