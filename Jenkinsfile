pipeline{

    agent any

    stages{
        stage ('Docker container'){
            
            steps{
                bat 'docker build -t jocatema/gestaoemprestimoscommand .'
            }

        }
    }
}